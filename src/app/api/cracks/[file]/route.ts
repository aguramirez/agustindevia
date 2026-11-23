import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;

    // Sanitize filename to prevent directory traversal
    const safeFile = path.basename(file);
    if (!['cracksmini.html'].includes(safeFile)) {
      return new NextResponse('Archivo no encontrado', { status: 404 });
    }

    const targetPath = path.join(process.cwd(), 'public', safeFile);

    if (!fs.existsSync(targetPath)) {
      return new NextResponse('Archivo no encontrado', { status: 404 });
    }

    const url = new URL(request.url);

    // SSE Watcher: Fires only when the user saves the file on disk (zero polling)
    if (url.searchParams.get('watch') === '1') {
      const encoder = new TextEncoder();
      let watcher: fs.FSWatcher | null = null;
      let debounceTimer: NodeJS.Timeout | null = null;

      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(': connected\n\n'));

          try {
            watcher = fs.watch(targetPath, (eventType) => {
              if (eventType === 'change' || eventType === 'rename') {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                  try {
                    controller.enqueue(encoder.encode('data: reload\n\n'));
                  } catch {
                    // Stream closed
                  }
                }, 120);
              }
            });
          } catch (err) {
            console.error('Error starting fs.watch for cracksmini:', err);
          }

          request.signal.addEventListener('abort', () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            if (watcher) {
              try {
                watcher.close();
              } catch {}
            }
          });
        },
        cancel() {
          if (debounceTimer) clearTimeout(debounceTimer);
          if (watcher) {
            try {
              watcher.close();
            } catch {}
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    let html = fs.readFileSync(targetPath, 'utf-8');

    // In development mode, inject event-driven watcher (ONLY triggers on file save, NO polling)
    if (process.env.NODE_ENV !== 'production') {
      const liveReloadScript = `
<script id="cracks-live-reload">
  (function() {
    if (!window.EventSource) return;
    var es = new EventSource('/api/cracks/${safeFile}?watch=1');
    es.onmessage = function(e) {
      if (e.data === 'reload') {
        es.close();
        window.location.reload();
      }
    };
  })();
</script>
`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${liveReloadScript}</body>`);
      } else {
        html += liveReloadScript;
      }
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error serving cracks demo:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
