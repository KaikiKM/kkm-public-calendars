document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  function fetchData() {
    return new Promise((resolve, reject) => {
      Tabletop.init({
        key: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSft4kbth8eKgyIv3PD8FQnAx0Dn1_EIGWxOrk9PvPKNfn5cZkwv5hwZ23jJ2EahL0DMJ2lKaSRF0Kz/pub?gid=0&single=true&output=csv',
        simpleSheet: true,
        callback: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: async function(info, successCallback, failureCallback) {
      try {
        const data = await fetchData();
        const events = data.map(event => ({
          title: event.title,
          start: `${event.startDate}T${event.startTime}`,
          end: `${event.endDate}T${event.endTime}`,
          description: event.description,
          location: event.location
        }));
        successCallback(events);
      } catch (error) {
        failureCallback(error);
      }
    }
  });

  calendar.render();

  // Funzionalità per copiare il link del calendario ICS
  const copyButton = document.getElementById('copy-link');
  const calendarLinkInput = document.getElementById('calendar-link');

  copyButton.addEventListener('click', function() {
    calendarLinkInput.select();
    document.execCommand('copy');
    alert('Link del calendario copiato!');
  });
});