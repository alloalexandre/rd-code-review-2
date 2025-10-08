# Starterkit: Meteor + React

This is a starter kit for building a Meteor + React application. Below are the steps to set up and run the project.

## 1. Initialize Git submodules

```bash
git submodule update --init --recursive
```

This command initializes and updates any Git submodules used by the project.

* **What it does:**

  * The repository contains submodules (other Git repositories embedded inside), this command downloads them.
  * Ensures you have all dependencies and sub-projects in sync.

## 2. Install project dependencies

```bash
meteor npm install
```

* **What it does:**

  * Installs all the Node.js dependencies defined in `package.json` for the Meteor app.
  * Prepares your project to run locally.

## 3. Run the Meteor application

```bash
meteor --settings settings.json --port 3000
```

* **What it does:**

  * Starts the Meteor server and serves your app.
  * Loads configuration values from `settings.json`.
  * Runs the app on **port 3000**.

**Note about `settings.json`:**

* This file contains configuration values, secrets, or environment-specific settings for your app.
* Example content:

```json
{
  "public": {
    "appName": "My Meteor App"
  },
  "privateKey": "your-secret-key"
}
```

Meteor reads this file at startup to configure your application.

## 4. (Optional) Seed fake development users

During local development you can quickly create (or update) test users by declaring them in `settings.json` under `private.fakeUsers`.

These users are:

* Only processed when `Meteor.isDevelopment === true` (they will be ignored in production builds).
* Idempotent: each entry is matched by `email`; running the app multiple times will update (not duplicate) the same user.
* Automatically assigned roles (global or scoped) and marked as email‐verified if you request it.
* Given a random password when you don’t specify one (the generated password is printed in the server console at startup).

### 4.1 Shape of a fake user object

```jsonc
{
  "email": "fake.admin@example.com",          // (required) unique identifier
  "firstName": "Fake",                        // optional (defaults: "Fake")
  "lastName": "Admin",                        // optional (defaults: "User")
  "password": "ChangeMe123!",                 // optional; if omitted a random password is generated & logged
  "roles": [                                   // optional array (defaults empty)
    { "id": "admin" }                         // role id must exist in ALL_ROLES
    { "id": "manager", "scope": "tenant-1" }  // example of a scoped role (none in starter yet, but supported)
  ],
  "verified": true,                            // optional (defaults true) – mark primary email as verified
  "sendEnrollment": false                      // optional (defaults false) – if true AND no password provided, sends enrollment email
}
```

### 4.2 Roles

Roles are defined centrally in `imports/globals/roles.js` inside the exported `ALL_ROLES` object. For the starter kit the available role ids are:

* `superAdmin`
* `admin`

If you introduce new roles, add them to `ALL_ROLES` first; seeding will reject any unknown role ids.

Scoped roles (roles tied to a group / tenant) are supported by passing a `scope` string alongside the role id (e.g. `{ "id": "admin", "scope": "tenant-42" }`). If `scope` is omitted or `null`, the role is global.

The first role in the `roles` array becomes the user’s primary role (stored in the `UserAccess` collection `role` field). Additional roles are still granted to the user through `alanning:roles`.

### 4.3 Example `settings.json` snippet

```jsonc
{
  "private": {
    // ...other private settings...
    "fakeUsers": [
      {
        "email": "fake.superadmin@example.com",
        "firstName": "Fake",
        "lastName": "SuperAdmin",
        "password": "ChangeMe123!",
        "roles": [{ "id": "superAdmin" }],
        "verified": true
      },
      {
        "email": "fake.admin@example.com",
        "firstName": "Fake",
        "lastName": "Admin",
        "roles": [{ "id": "admin" }],
        "verified": true,
        "sendEnrollment": false
      }
    ]
  }
}
```

### 4.4 When does seeding happen?

On server startup (file: `imports/startup/server/_fakeUsers.js`). If you edit `settings.json`, simply restart Meteor to apply changes. Updated names / roles will be applied to existing seeded users.

### 4.5 Generated passwords

If you omit `password`, a secure random password (12 chars) is created and logged like:

```
[FAKE USERS] Generated password for fake.admin@example.com: abCDef123XYZ
```

Copy it immediately if you need to log in with that account.

### 4.6 Creating a user on the fly (programmatic)

You can also manually trigger creation inside a server console / method using the helper exported from `imports/utils/seedFakeUsers.js`:

```js
import { upsertFakeUser } from '/imports/utils/seedFakeUsers';

await upsertFakeUser({
  email: 'dev.temp@example.com',
  roles: [{ id: 'admin' }]
});
```

### 4.7 Safety notes

* Never commit production credentials or real user data under `fakeUsers`.
* The entire `fakeUsers` block should be excluded or pruned from production `settings.json` files.
* Seeding is gated by `Meteor.isDevelopment`; if you accidentally deploy settings containing `fakeUsers`, they are ignored.
