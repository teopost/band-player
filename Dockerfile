# Usa un'immagine base di Python
FROM python:3.9-slim

# Imposta variabili d'ambiente per UID e GID
ARG UID=1000
ARG GID=1000

# Crea un gruppo e un utente con l'UID e GID specificati
RUN groupadd -g $GID appuser && \
    useradd -u $UID -g $GID -m appuser

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di dipendenze
COPY requirements.txt .

# Installa le dipendenze
RUN pip install --no-cache-dir -r requirements.txt

# Copia il resto dell'applicazione
COPY . .

# Cambia il proprietario dei file all'utente appuser
RUN chown -R appuser:appuser /app

# Passa all'utente appuser
USER appuser

# Esponi la porta su cui gira Flask
EXPOSE 5015

# Comando per avviare l'applicazione
CMD ["python", "app.py"]
