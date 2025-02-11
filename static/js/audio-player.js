document.addEventListener('DOMContentLoaded', () => {
    let currentHighlightedItem = null;
    let currentFolder = '';

    const updateAudioList = (folder) => {
        fetch(`/load-audio?folder=${encodeURIComponent(folder)}`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('audio-list').innerHTML = html;
                document.getElementById('selected-folder').textContent = `Cartella corrente: ${folder}`;
                currentFolder = folder;
                attachAudioHandlers();
            });
    };

    const handlePlay = (e) => {
        if(currentHighlightedItem) {
            currentHighlightedItem.classList.remove('playing');
        }
        
        currentHighlightedItem = e.target.closest('.list-group-item');
        currentHighlightedItem.classList.add('playing');
    };

    const handleEnded = (e) => {
        const currentItem = e.target.closest('.list-group-item');
        const nextAudio = currentItem.nextElementSibling?.querySelector('audio');

        if(nextAudio) {
            currentItem.classList.remove('playing');
            const nextItem = nextAudio.closest('.list-group-item');
            nextItem.classList.add('playing');
            nextAudio.play();
        } else {
            currentItem.classList.remove('playing');
        }
    };

    const attachAudioHandlers = () => {
        document.querySelectorAll('audio').forEach(audio => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('ended', handleEnded);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('ended', handleEnded);
        });
    };

    document.querySelectorAll('[data-folder]').forEach(button => {
        button.addEventListener('click', (e) => {
            const newFolder = e.target.dataset.folder;
            if(newFolder !== currentFolder) {
                // Rimuovi la classe 'btn-active' da tutti i pulsanti
                document.querySelectorAll('[data-folder]').forEach(btn => {
                    btn.classList.remove('btn-active');
                });
                
                // Aggiungi la classe al pulsante cliccato
                e.target.classList.add('btn-active');
                
                // Aggiorna la lista
                if(currentHighlightedItem) {
                    currentHighlightedItem.classList.remove('playing');
                }
                updateAudioList(newFolder);
            }
        });
    });

    // Inizializza il pulsante attivo all'avvio
    document.querySelector('[data-folder].btn-active')?.classList.add('btn-active');

    // Inizializzazione
    attachAudioHandlers();
});