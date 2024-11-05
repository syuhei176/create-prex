#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import {
  createClickableLink,
  isValidPackageName,
  toValidPackageName,
  optimizedCopy,
} from './utils.js';

function getTemplateDir(framework: string, passkeyWallet: boolean) {
  return path.resolve(
    fileURLToPath(import.meta.url),
    `../../../templates/${framework}${passkeyWallet ? '' : '-ex'}`
  );
}

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
  '_env.local': '.env.local',
};

const excludeDirs = ['node_modules', '.next'];
const excludeFiles = ['.DS_Store', 'Thumbs.db'];

async function copyDir(src: string, dest: string) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, renameFiles[entry.name] || entry.name);

    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        await copyDir(srcPath, destPath);
      }
    } else {
      if (!excludeFiles.includes(entry.name)) {
        await optimizedCopy(srcPath, destPath);
      }
    }
  }
}

async function init() {
  console.log(
    `${pc.greenBright(`/* Prex UIKit */`)}\n\n`
  );

  const defaultProjectName = 'my-prex-app';

  let result: prompts.Answers<
    'projectName' | 'packageName' | 'policyId' | 'apiKey' | 'passkeyWallet' | 'reownProjectId' | 'framework'
  >;

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: pc.reset('Project name:'),
          initial: defaultProjectName,
          onState: (state) => {
            state.value = state.value.trim();
          },
          validate: (value) => {
            const targetDir = path.join(process.cwd(), value);
            if (
              fs.existsSync(targetDir) &&
              fs.readdirSync(targetDir).length > 0
            ) {
              return 'Directory already exists and is not empty. Please choose a different name.';
            }
            return true;
          },
        },
        {
          type: (_, { projectName }: { projectName: string }) =>
            isValidPackageName(projectName) ? null : 'text',
          name: 'packageName',
          message: pc.reset('Package name:'),
          initial: (_, { projectName }: { projectName: string }) =>
            toValidPackageName(projectName),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: 'text',
          name: 'policyId',
          message: pc.reset(
            `Enter your ${createClickableLink(
              'Prex Policy ID:',
              'https://dashboard.prex0.com'
            )} (optional)`
          ),
        },
        {
          type: 'password',
          name: 'apiKey',
          message: pc.reset(
            `Enter your ${createClickableLink(
              'Prex API Key:',
              'https://dashboard.prex0.com'
            )} (optional)`
          ),
        },
        {
          type: 'toggle',
          name: 'passkeyWallet',
          message: pc.reset('Use Passkey Wallet? (recommended)'),
          initial: true,
          active: 'yes',
          inactive: 'no',
        },
        {
          type: prev => prev === false ? 'text' : null,
          name: 'reownProjectId',
          message: pc.reset('Enter your Reown Project ID:'),
          initial: '',
        },
        {
          type: 'select',
          name: 'framework',
          message: 'Pick framework',
          choices: [
            { title: 'Next.JS', value: 'next' },
          ],
        }
      ],
      {
        onCancel: () => {
          console.log('\nProject creation cancelled.');
          process.exit(0);
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const { projectName, packageName, policyId, apiKey, passkeyWallet, reownProjectId, framework } = result;
  console.log(projectName, packageName, policyId, apiKey, passkeyWallet, reownProjectId, framework);
  const root = path.join(process.cwd(), projectName);

  const spinner = ora(`Creating ${projectName}...`).start();

  await copyDir(getTemplateDir(framework, passkeyWallet), root);

  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));
  pkg.name = packageName || toValidPackageName(projectName);
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // Create .env file
  const envPath = path.join(root, '.env');

  if(passkeyWallet) {
    await fs.promises.writeFile(
      envPath,
      `NEXT_PUBLIC_DRY_RUN=true\nNEXT_PUBLIC_PREX_PROJECT_NAME=${projectName}\nNEXT_PUBLIC_PREX_POLICY_ID=${policyId}\nNEXT_PUBLIC_PREX_API_KEY=${apiKey}`
    );
  
  } else {
    await fs.promises.writeFile(
      envPath,
      `NEXT_PUBLIC_DRY_RUN=true\nNEXT_PUBLIC_PREX_PROJECT_NAME=${projectName}\nNEXT_PUBLIC_PREX_POLICY_ID=${policyId}\nNEXT_PUBLIC_PREX_API_KEY=${apiKey}\NEXT_PUBLIC_REOWN_PROJECT_ID=${
        reownProjectId
      }`
    );
  }

  spinner.succeed();
  console.log(`\n${pc.magenta(`Created new Prex app in ${root}`)}`);

  console.log(`\nUsing:`);
  if (passkeyWallet) {
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(`Passkey Wallet`)}`
    );
  }
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Base`)}`);
  if (reownProjectId) {
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(
        `Reown(Wallet Connect)`
      )}`
    );
  }

  console.log(`\nFrameworks:`);
  console.log(`${pc.cyan('- React')}`);
  console.log(`${pc.cyan('- Next.js')}`);
  console.log(`${pc.cyan('- shadcn/ui')}`);
  console.log(`${pc.cyan('- Tailwindcss')}`);
  console.log(`${pc.cyan('- ESLint')}`);

  console.log(
    `\nTo get started with ${pc.green(
      projectName
    )}, run the following commands:\n`
  );
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(' - npm install');
  console.log(' - npm run dev');
}

init().catch((e) => {
  console.error(e);
});
