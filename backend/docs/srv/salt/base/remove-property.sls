remove-application-property:
  file.replace:
    - name: {{ grains['properties_path'] }}
    - pattern: '^{{ pillar['property_key'] }}=.*\n'
    - repl: ''
    - backup: '.bak'

restart-application-after-property-removal:
  cmd.run:
    - name: |
        pkill -f application.jar || true
        sleep 2
        cd {{ grains['app_path'] }}
        nohup java -jar application.jar > application.log 2>&1 &
    - user: appuser
    - onchanges:
      - file: remove-application-property