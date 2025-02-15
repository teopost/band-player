document.addEventListener('DOMContentLoaded', () => {
    let currentHighlightedItem = null;
    let currentFolder = document.querySelector('.btn-active')?.dataset.folder || '';

    const updateAudioList = (folder) => {
        fetch(`/load-audio?folder=${encodeURIComponent(folder)}`)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.getElementById('audio-list');
                
                if (newContent) {
                    document.getElementById('audio-list').innerHTML = newContent.innerHTML;
                    document.getElementById('selected-folder').textContent = `Cartella selezionata: ${folder}`;
                    currentFolder = folder;
                    attachAudioHandlers();
                }
            })
            .catch(error => console.error('Error:', error));
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
                document.querySelectorAll('[data-folder]').forEach(btn => {
                    btn.classList.remove('btn-active');
                });
                e.target.classList.add('btn-active');
                
                if(currentHighlightedItem) {
                    currentHighlightedItem.classList.remove('playing');
                }
                updateAudioList(newFolder);
            }
        });
    });

    // Inizializzazione
    attachAudioHandlers();
    document.getElementById('selected-folder').textContent = `Cartella selezionata: ${currentFolder}`;
});