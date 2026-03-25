import { useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"

/**
 * Generic OAuth callback page.
 *
 * Mounted at /auth/callback/:provider (e.g. /auth/callback/google).
 *
 * Google responds with an implicit flow — the access_token lands in the URL
 * hash fragment (#access_token=...).
 *
 * GitHub responds with a code in the query string (?code=...).
 *
 * In both cases we forward the relevant value to the opener window via
 * postMessage and close the popup.
 */
export default function OAuthCallback() {
  const { provider } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (!window.opener) return

    let code = null
    let error = null

    if (provider === "google") {
      // Google implicit flow: token in hash
      const hash = new URLSearchParams(location.hash.replace("#", ""))
      code = hash.get("access_token")
      error = hash.get("error")
    } else if (provider === "github") {
      // GitHub: code in query string
      const params = new URLSearchParams(location.search)
      code = params.get("code")
      error = params.get("error")
    }

    window.opener.postMessage(
      { provider, code, error: error || null },
      window.location.origin
    )

    window.close()
  }, [provider, location])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-muted-foreground text-sm">Completing sign-in…</p>
    </div>
  )
}
