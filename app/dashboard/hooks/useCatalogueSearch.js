"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  if (a === b) return 0
  const al = a.length, bl = b.length
  if (al === 0) return bl
  if (bl === 0) return al
  const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1))
  for (let i = 0; i <= al; i++) dp[i][0] = i
  for (let j = 0; j <= bl; j++) dp[0][j] = j
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }
  return dp[al][bl]
}

function scoreItem(query, item) {
  const name = (item.namaBarang || '').toLowerCase()
  const spec = (item.spesifikasi || '').toLowerCase()
  const jenis = (item.jenis || '').toLowerCase()
  const q = query.toLowerCase().trim()
  if (!q) return 0
  if (!name && !spec) return 0

  // Direct equality
  if (name === q) return 120
  if (spec === q) return 110

  let best = 0

  const fields = [name, spec, jenis]
  for (const field of fields) {
    if (!field) continue
    const idx = field.indexOf(q)
    if (idx === 0) {
      // prefix boost
      best = Math.max(best, 90 - Math.min(10, field.length - q.length))
    } else if (idx > 0) {
      best = Math.max(best, 70 - idx)
    } else {
      // fuzzy distance on name only for performance
      if (field === name && q.length >= 3) {
        const dist = levenshtein(field.slice(0, q.length + 3), q)
        const fuzzyScore = 60 - dist * 8
        best = Math.max(best, fuzzyScore)
      }
    }
  }

  return best
}

export function useCatalogueSearch(allItems = []) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [filtered, setFiltered] = useState(allItems)
  const abortRef = useRef(null)

  // Local filtering & scoring
  useEffect(() => {
    if (!query) {
      setSuggestions([])
      setFiltered(allItems)
      return
    }
    if (query.length < 2) {
      setSuggestions([])
      setFiltered(allItems)
      return
    }
    const scored = allItems
      .map(item => ({ item, score: scoreItem(query, item) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
    setSuggestions(scored.map(s => s.item))
    // Filtered list broader substring OR fuzzy threshold
    const filteredList = allItems.filter(i => {
      const name = (i.namaBarang || '').toLowerCase()
      const spec = (i.spesifikasi || '').toLowerCase()
      const jenis = (i.jenis || '').toLowerCase()
      const q = query.toLowerCase()
      return (
        name.includes(q) ||
        spec.includes(q) ||
        jenis.includes(q) ||
        scoreItem(query, i) > 65
      )
    })
    setFiltered(filteredList)
  }, [query, allItems])

  // Optional remote refresh when not enough suggestions
  const fetchRemote = useCallback(async (q) => {
    if (!q || q.length < 2) return
    try {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      const res = await fetch(`/api/catalogues?limit=10&search=${encodeURIComponent(q)}`, { signal: controller.signal })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        // Merge new items if not present (caller can decide to update state outside this hook)
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Remote search error', e)
    }
  }, [allItems])

  useEffect(() => {
    if (query && suggestions.length < 3) fetchRemote(query)
  }, [query, suggestions.length, fetchRemote])

  return { query, setQuery, suggestions, filtered }
}
