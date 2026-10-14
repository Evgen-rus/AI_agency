# Sites publication

The existing prototype is published through the Sites plugin as a static Vite build. `.openai/hosting.json` holds the exact Site ID and declares `dist/` as the static directory. Reuse that ID; never create another Site for updates.

The isolated source checkout is `.sites/leadgenbureau-ai-agency/`, excluded from the main repository. It contains application source and a separate Sites Git history. The main GitHub remote is unchanged. Refresh the publishing copy from the current application before future publication; do not assume it tracks edits automatically.

Use the plugin's `site-workflow.mjs` helper with the returned short-lived credential supplied through hidden stdin. Never persist or print the token. Record its pushed commit and archive. Current access is public: call `save_site_version`, then `deploy_site_version`, preserving that audience.

## Windows packaging

The existing Git Bash is required by the archive helper. Add `C:\Program Files\Git\bin` and `C:\Program Files\Git\usr\bin` to the helper process PATH. Set `TAR_OPTIONS=--force-local` in that process so tar treats `D:/...` as a local path.

The plugin build helper's npm shim failed on this host. A normal PowerShell `npm run build` in the publishing checkout succeeded; unchanged completed builds permit `commands: []` in the source helper. Keep the working plugin installation untouched.

## Access

The owner explicitly opened public access and authorized public concept updates. `public` allows anyone with the URL; `workspace_all` allows workspace members; `custom` uses selected viewers/groups. Preserve public access for updates. C is at `/`; A is at `/revenue-os/`, with separate static HTML entries.

The preparation form still produces a local browser draft, without sending or storing it. Deployment does not add a backend or a lead reception channel.
