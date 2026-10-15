# Sites publication

The site is published through the Sites plugin as a static Vite build. `.openai/hosting.json` holds the exact Site ID and declares `dist/` as the static directory. Reuse that ID; never create another Site for updates.

The published copy is `.sites/leadgenbureau-ai-agency/`, excluded from the main repository; it carries its own Sites Git history and is not synchronized automatically. Refresh it from the current application before publishing, then build `dist/` with three entries: `index.html` (root redirect and 404), `agency/index.html` and `neurorop/index.html`.

Use the plugin's `site-workflow.mjs` helper with the short-lived credential supplied through hidden stdin. Never persist or print the token, and record the pushed commit. Current access is public: call `save_site_version`, then `deploy_site_version`, preserving that audience.

## Windows packaging

The existing Git Bash is required by the archive helper. Add `C:\Program Files\Git\bin` and `C:\Program Files\Git\usr\bin` to the helper process PATH. Set `TAR_OPTIONS=--force-local` in that process so tar treats `D:/...` as a local path.

The plugin build helper's npm shim failed on this host. A normal PowerShell `npm run build` in the publishing checkout succeeded; unchanged completed builds permit `commands: []` in the source helper. Keep the working plugin installation untouched.

## Access

The owner explicitly opened public access. `public` allows anyone with the URL; `workspace_all` allows workspace members; `custom` uses selected viewers/groups. Preserve public access for updates: `/` redirects to `/agency/`, `/neurorop/` is the product landing, and unknown paths show the 404 page.

The contact form still produces a local browser draft only, without sending or storing it. Publishing adds no backend or lead-reception channel.
