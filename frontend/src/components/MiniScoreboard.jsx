import { useEffect } from 'react';

export default function MiniScoreboard({ match }) {
  useEffect(() => {
    // Copy the main app's stylesheets to the PiP window
    if (window.documentPictureInPicture && window.documentPictureInPicture.window) {
      const pipDoc = window.documentPictureInPicture.window.document;
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          if (styleSheet.href) {
            const link = pipDoc.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            pipDoc.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = pipDoc.createElement('style');
            Array.from(styleSheet.cssRules).forEach((rule) => {
              style.appendChild(pipDoc.createTextNode(rule.cssText));
            });
            pipDoc.head.appendChild(style);
          }
        } catch (e) {
          // Ignore CORS errors for cross-origin stylesheets
        }
      });
      pipDoc.body.style.background = '#0B1320';
      pipDoc.body.style.color = '#fff';
      pipDoc.body.style.margin = '0';
      pipDoc.body.style.padding = '12px';
      pipDoc.body.style.fontFamily = 'Inter, sans-serif';
    }
  }, []);

  if (!match) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#78909C' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', marginRight: '6px', animation: 'pulse 1.5s infinite' }} />
          LIVE
        </span>
        <span style={{ fontSize: '12px', color: '#00E5FF' }}>Target: {match.target}</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🇮🇳 {match.homeTeam || 'IND-W'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🇦🇺 {match.awayTeam || 'AUS-W'}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#00E5FF' }}>
            {match.score?.runs || 0}/{match.score?.wickets || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#78909C' }}>
            {match.score?.overs || '0.0'} overs
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#B0BEC5', marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <span>CRR: {match.runRate}</span>
        <span>REQ: {match.requiredRunRate}</span>
      </div>
    </div>
  );
}
