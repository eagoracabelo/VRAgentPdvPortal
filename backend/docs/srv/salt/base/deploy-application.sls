# Parar aplicação atual
stop-application:
  cmd.run:
    - name: pkill -f application.jar || true
    - user: appuser

# Backup da versão atual
backup-current-version:
  cmd.run:
    - name: |
        if [ -f {{ pillar['app_path'] }}/application.jar ]; then
          cp {{ pillar['app_path'] }}/application.jar {{ pillar['app_path'] }}/application.jar.backup
        fi
    - user: appuser

# Download da nova versão
download-new-version:
  file.managed:
    - name: {{ pillar['app_path'] }}/application.jar
    - source: {{ pillar['app_file_path'] }}
    - source_hash: sha256={{ pillar['app_file_hash'] }}
    - user: appuser
    - group: appuser
    - mode: 755
    - makedirs: True
    - require:
      - cmd: stop-application

# Atualizar grains com nova versão
update-version-grain:
  grains.present:
    - name: current_app_version
    - value: {{ pillar['app_version'] }}
    - require:
      - file: download-new-version

# Iniciar aplicação
start-application:
  cmd.run:
    - name: |
        cd {{ pillar['app_path'] }}
        nohup java -jar application.jar > application.log 2>&1 &
    - user: appuser
    - require:
      - grains: update-version-grain