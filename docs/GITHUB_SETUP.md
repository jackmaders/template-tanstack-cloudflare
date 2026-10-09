# GitHub repository setup

Configure these settings after creating a repository from this template. Cloning the code does not apply repository settings. You need repository admin access; branch rulesets for private repositories require GitHub Pro, Team, or Enterprise Cloud. See [GitHub ruleset setup](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).

## Configure merges and branch cleanup

In **Settings → General → Pull Requests**:

- Enable **Allow squash merging** and disable **Allow merge commits** and **Allow rebase merging**.
- Set the default squash commit message to **Pull request title and description**. Use a Conventional Commit PR title, such as `feat: add post search`, so the resulting commit follows the project's commit convention.
- Enable **Automatically delete head branches** to remove the source branch after merging. Target protection rules at `main` so feature branches can be deleted.

See GitHub's [merge settings](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges) and [automatic branch deletion](https://docs.github.com/en/enterprise-cloud%40latest/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches).

## Protect `main`

In **Settings → Rules → Rulesets → New ruleset → New branch ruleset** (the sidebar may label this **Rulesets**):

1. Name the ruleset `Protect main`, set enforcement to **Active**, and target the branch name `main`.
2. Leave the **Bypass list** empty so admins and automation follow the same merge requirements.
3. Enable **Restrict deletions**, **Block force pushes**, and **Require linear history**.
4. Enable **Require a pull request before merging**, with:
   - At least **1 required approval**; use 2 when the team can support it.
   - **Dismiss stale pull request approvals when new commits are pushed**.
   - **Require approval of the most recent reviewable push**.
   - **Require conversation resolution before merging**.
5. Enable **Require status checks to pass** and **Require branches to be up to date before merging**, then add every check below.

A solo maintainer needs another eligible reviewer to satisfy required approvals. See [available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

For classic branch protection, go to **Settings → Branches → Add branch protection rule**, target `main`, apply the equivalent settings, and enable **Do not allow bypassing the above settings**.

## Require the existing PR checks

Open an initial PR and let [PR Quality Checks](../.github/workflows/pull-request-checks.yml) run. Select the exact check names shown by GitHub, including each browser matrix entry, and select **GitHub Actions** as the expected source where available:

| Required check | What it validates |
| --- | --- |
| `🧪 Run Unit Tests` | Unit and integration tests |
| `📦 Verify Build Health` | Production build, generated route tree, and Worker deployment dry run |
| `🛡️ Prevent Artifact Drift` | Cloudflare types, generated migrations, and at most one new SQL migration per PR |
| `🎭 Run Browser Tests (chromium)` | Chromium E2E tests |
| `🎭 Run Browser Tests (firefox)` | Firefox E2E tests |
| `🎭 Run Browser Tests (webkit)` | WebKit E2E tests |
| `🔦 Run Lighthouse Check` | Configured Lighthouse assertions |
| `✨ Check Code Quality` | Biome, unused code/dependencies, and TypeScript |

There are **8 required check results**. Require all three browser results separately. The build config sets a 1500 KB SSR chunk warning threshold; it does not fail CI based on chunk size. The PR Agent Review and production deployment workflows are manually triggered and are not required PR checks.

Keep required job names unique across workflows and update the ruleset whenever you rename a job. Avoid workflow path filters that leave required checks pending. GitHub accepts successful, skipped, or neutral required checks, so keep mandatory jobs unconditional; browser and Lighthouse jobs currently depend on a successful build. See [required check troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).

Before merging, update the branch with `main`, wait for all required checks on the latest revision, obtain approvals, and resolve review conversations. Choose **Squash and merge**, review the final commit message, and confirm that GitHub deletes the source branch afterward. Start subsequent work from the updated `main`.

## Additional practices for a strict codebase

These are recommendations; some require new repository files or workflow changes.

- **Require code owner reviews.** Add `.github/CODEOWNERS` for feature slices and sensitive areas such as authentication, database migrations, `.github/`, and `.config/`. Include the CODEOWNERS file itself, then enable required code owner approval. See [code ownership for workflows](https://docs.github.com/en/actions/reference/security/secure-use#using-codeowners-to-monitor-changes).
- **Secure GitHub Actions.** Set default workflow permissions to read repository contents, grant extra permissions only to jobs that need them, and pin external actions to full commit SHAs. The PR Agent action is pinned to a full SHA; other external actions still use version tags. See [secure use of Actions](https://docs.github.com/en/actions/reference/security/secure-use).
- **Automate dependency and security maintenance.** Configure Dependabot for dependencies and GitHub Actions, and enable Dependabot alerts, secret scanning, push protection, and code scanning where supported by your plan. Assign someone to resolve alerts. See [security settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository).
- **Enforce PR conventions in CI.** Add a PR template covering purpose, validation, migrations, and rollout, plus a required Conventional Commit PR-title check. Local commitlint hooks already exist, but GitHub edits and skipped hooks need CI enforcement.
- **Keep builds reproducible.** Commit `bun.lock` and migrations, use the pinned Bun version, and install with `--frozen-lockfile` as CI already does. Review dependency updates through the same required checks.
- **Protect production deployments.** Create a `production` GitHub environment restricted to the `main` branch and configure required reviewers before using the deploy workflow. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as environment secrets, and set its `PRODUCTION_URL` variable to the deployed Worker URL. Before dispatching deployment, verify that **PR Quality Checks** succeeded for the exact `main` commit you intend to deploy. The workflow uses that environment, accepts dispatches only from `main`, and passes its `PRODUCTION_URL` to the browser and Lighthouse checks without a placeholder fallback. See [environment protection](https://docs.github.com/en/actions/reference/security/secure-use#consider-requiring-review-for-access-to-secrets).
- **Use a merge queue when PR volume grows.** Add a `merge_group` trigger to the quality workflow before requiring the queue, and configure its merge method as squash. The current workflow lacks that trigger. See [merge queue setup](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue).
