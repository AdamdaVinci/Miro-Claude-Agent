'use client'; // Označení jako klientská komponenta

import React, { useState, useEffect } from 'react';
// Import Miro SDK typů pokud jsou potřeba pro getSelection, např. StickyNote, Shape
// import { StickyNote, Shape } from '@mirohq/websdk-types'; // Odkomentujte pokud je potřeba
import '../assets/style.css';

// Typ pro položky, které mohou mít textový obsah
type ItemWithContent = { content?: string; id: string, type: string };

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [claudeResponse, setClaudeResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMiroReady, setIsMiroReady] = useState(false);

  useEffect(() => {
    // Počkáme, až bude Miro SDK připraveno
    const checkMiro = () => {
      if (window.miro) {
        setIsMiroReady(true);
      } else {
        setTimeout(checkMiro, 100); // Zkusíme znovu za 100ms
      }
    };
    checkMiro();
  }, []);

  const handleSendQuery = async () => {
    if (!prompt.trim() || !isMiroReady) return;

    setIsLoading(true);
    setError(null);
    setClaudeResponse('');

    try {
      // Získání vybraných položek na Miro boardu
      const selection = await window.miro.board.getSelection();

      // Extrahování textového obsahu (zjednodušený příklad pro kartičky a tvary)
      const context = selection
        .map((item: ItemWithContent) => {
            // Jednoduchý regex pro odstranění HTML tagů, nemusí být dokonalý
            const cleanContent = item.content?.replace(/<[^>]*>?/gm, '') || '';
            if (cleanContent) {
                return `- ${item.type} (ID: ${item.id}): ${cleanContent}`;
            }
            return null;
        })
        .filter(Boolean) // Odstraní null hodnoty
        .join('\n');

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setClaudeResponse(data.response);

    } catch (err) {
      console.error('Failed to fetch Claude response:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMiroReady) {
      return <div className="grid wrapper"><div>Loading Miro SDK...</div></div>;
  }

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>Chat with Claude about Miro selection</h1>

        <div className="form-group">
          <label htmlFor="prompt">Your question:</label>
          <textarea
            id="prompt"
            className="textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something about the selected items..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        <button
          className="button button-primary"
          onClick={handleSendQuery}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Asking Claude...' : 'Ask Claude'}
        </button>

        {error && (
          <div className="message message-danger" style={{marginTop: '1em'}}>
            <p>Error: {error}</p>
          </div>
        )}

        {claudeResponse && (
          <div style={{marginTop: '1em', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '1em', background: '#f9f9f9'}}>
            <strong>Claude's response:</strong>
            <p>{claudeResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
