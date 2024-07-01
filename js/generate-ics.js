document.getElementById('generate-ics').addEventListener('click', function() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSft4kbth8eKgyIv3PD8FQnAx0Dn1_EIGWxOrk9PvPKNfn5cZkwv5hwZ23jJ2EahL0DMJ2lKaSRF0Kz/pub?gid=0&single=true&output=csv';

  // Funzione per scaricare il file
  function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  // Recupero dei dati CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//NONSGML v1.0//EN\n';

      data.forEach(event => {
        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `SUMMARY:${event.title}\n`;
        icsContent += `DTSTART:${event.startDate.replace(/-/g, '')}T${event.startTime.replace(/:/g, '')}00Z\n`;
        icsContent += `DTEND:${event.endDate.replace(/-/g, '')}T${event.endTime.replace(/:/g, '')}00Z\n`;
        icsContent += `DESCRIPTION:${event.description}\n`;
        icsContent += `LOCATION:${event.location}\n`;
        icsContent += 'END:VEVENT\n';
      });

      icsContent += 'END:VCALENDAR';

      download(icsContent, 'calendar.ics', 'text/calendar');
    },
    error: function(error) {
      console.error('Errore nel recupero del CSV:', error);
    }
  });
});