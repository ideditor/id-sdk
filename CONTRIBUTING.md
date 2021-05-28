# Contributing to iD-sdk

## Contributing Code

Before performing any code changes go through the following setup:

$  git checkout main
$  git pull origin
$  yarn                   # update monorepo root and install subpackage dependencies
$  yarn run all           # cleans & builds packages
- You shouldn't see any changes after this step.

Create the topic branch based on the workspace you are planning to use.
(e.g. If working on math/geom the branch should start with: packages/math/geom)

If working on existing workspaces, just edit the existing code.
If adding the new workspace (name: $workspaceName), copy any existing workspace and do the following:
- Change folder name to $workspaceName
- Modify package.json properties:
    - 'name' = @id-sdk/$workspaceName.
    - 'version' = "3.0.0-pre.1",
    - 'description' = provide meaning description to the workspace
    - 'contributors' = about you
    - 'main' & 'module' - start file
- Craft README.md accordingly
- Add appropriate source code to src/ and tests to tests/

After performing code changes, check if there are build and test passes:
$  yarn run all
$  yarn run test

If build/test passes, bump versions and push a code change:
$  npx lerna version

Create a PR and once passed finally perform:
$  npx lerna publish from-git

### Using workspace dependencies

If working inside workspaceA and you need a requirement from workspaceB perform the following:
Insde workspaceA/src/?.ts put following line:
import { ... } from '@id-sdk/workspaceB';
In order for IDE (VSCode) to perform autocomplete/navigation features on such dependencies make sure of the following:
1) workspaceB is inside the root/node_modules/@id-sdk folder
- This is achieved by running the 'yarn' command. If you are creating new workspace which you need to take dependency on from another workspace, make sure you execute
'yarn' command once you create the new workspace.
2) workspaceB is freshly built (workspaceB/built/ folder should contain appropriate js, .d.ts translation files)
-  This is achieved by running from the root 'yarn run all' command or by building just the workspace you require.

VSCode - If after these steps IDE still reports the error: Cannot find module '@id-sdk/workspaceB' or its corresponding type declarations...
Try to remove and then add that line of code (import...).