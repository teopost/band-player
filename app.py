from flask import Flask, render_template, request
import os
import yaml

app = Flask(__name__)

# Percorso della cartella contenente i file audio
AUDIO_FOLDER = 'static/audio'

# Carica il file di configurazione YAML
with open('config.yaml', 'r') as config_file:
    config = yaml.safe_load(config_file)

@app.route('/')
def index():
    # Ottieni le sottocartelle
    subfolders = [f for f in os.listdir(AUDIO_FOLDER) if os.path.isdir(os.path.join(AUDIO_FOLDER, f))]
    # Carica i file audio dalla prima sottocartella (o dalla root se non ci sono sottocartelle)
    current_folder = subfolders[0] if subfolders else ''
    audio_files = get_audio_files(current_folder)
    return render_template('index.html', audio_files=audio_files, subfolders=subfolders, current_folder=current_folder, config=config['app'])

@app.route('/load-audio')
def load_audio():
    folder = request.args.get('folder', '')
    audio_files = get_audio_files(folder)
    return render_template('audio_list.html', audio_files=audio_files, current_folder=folder)

def get_audio_files(folder):
    folder_path = os.path.join(AUDIO_FOLDER, folder)
    # Ottieni i file audio e ordinali
    return sorted([f for f in os.listdir(folder_path) if f.endswith(('.mp3', '.wav', '.ogg'))])

if __name__ == '__main__':
    # Imposta il debug mode in base alla variabile d'ambiente
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    app.run(host='0.0.0.0', port=5015)
