update-application-property:
  file.replace:
    - name: {{ grains['properties_path'] }}
    - pattern: '^{{ pillar['property_key'] }}=.*$'
    - repl: '{{ pillar['property_key'] }}={{ pillar['property_value'] }}'
    - count: 1
    - append_if_not_found: True
    - backup: '.bak'

restart-application-after-property-change:
  cmd.run:
    - name: |
        pkill -f application.jar || true
        sleep 2
        cd {{ grains['app_path'] }}
        nohup java -jar application.jar > application.log 2>&1 &
    - user: appuser
    - onchanges:
      - file: update-application-property