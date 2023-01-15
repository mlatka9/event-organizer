# Organizator wydarzeń

## Opis

Celem pracy jest stworzenie serwisu, który pozwoli na organizację oraz promocję wydarzeń.
Ma on ułatwić użytkownikom proces znajdowania interesujących dla nich wydarzeń. Każdy
użytkownik może utworzyć w serwisie dowolne wydarzenie takie jak koncert lokalnego
zespołu, prelekcja czy ognisko. Może określić czy wydarzenie powinno być widoczne dla
wszystkich, czy tylko ma być udostępnione wybranej grupie osób.

Serwis dostarcza liczne opcjonalne moduły, które mają za zadanie ułatwić komunikację
między organizatorem a odbiorcami. Są to między innymi podział wydatków grupowych,
wybieranie wspólnego terminu wydarzenia czy czat.
Organizator może dowolnie skonfigurować wydarzenie, wybierając tylko te moduły, które
najbardziej odpowiadają jego potrzebom. To organizator decyduje, jak bardzo rozbudowane
powinno być jego wydarzenie.

Serwis pozwala na łączenie się osób o podobnych zainteresowaniach i pasjach. Dzięki
grupom tematycznym każdy użytkownik ma możliwość dzielenia się interesującymi
wydarzeniami z innymi. Może być to idealne miejsce spotkań dla pasjonatów czy znajomych.
Jednym z głównych celów aplikacji jest zapewnienie najlepszej komunikacji, między
organizatorami wydarzeń a uczestnikami. Uczestnicy mogą mieć bezpośredni wpływ na
wydarzenie.

### Przykłady użycia aplikacji:
- Lokalna społeczność tworzy grupę klubu sportowego, któremu wszyscy kibicują. Jest
ona widoczna publicznie dla wszystkich użytkowników serwisu. Uczestnicy nogą
tworzyć dowolne wydarzenia takie jak mecze ich zespołu czy spotkania integracyjne.
Dzięki wspólnej platformie mogą szybko porozumieć się i razem planować spotkania.
- Znajomi zakładają dla siebie prywatną grupę. Tylko właściciel może dodać nowych
członków, dzięki czemu uczestnicy mogą się na niej bezpiecznie komunikować.
Mogą oni planować z wyprzedzeniem wydarzenia takie jak wspólne wyjścia do kina
czy ogniska. Dzięki modułom mogą oni bez najmniejszego problemu wybrać termin,
który będzie dla wszystkich odpowiedni.
- Lokalny zespół muzyczny zamierza zorganizować swój pierwszy koncert. Mogą oni
stworzyć wydarzenie, które udostępnią na grupie fanów muzyki rockowej w swoim
mieście. Aplikacja daje im łatwy sposób na znalezienie odbiorców oraz promocję
swojej działalności. Po zakończonym wydarzeniu mogą zebrać opinie od
uczestników, które pomogą im się rozwinąć.

## Diagram ERD

![erd2](https://user-images.githubusercontent.com/72691985/212567675-9d6659c2-2c99-4c6e-82d8-b4fcb517b20c.jpg)


## Wykorzystane technologie

- TypeScript
- React.js
- TailwindCSS
- Express.js
- Prisma
- PostgreSQL

## Dokumentacja aplikacji serwerowej

- Swagger [https://app.swaggerhub.com/apis-docs/mlatka9/event-organizer/1.0](https://app.swaggerhub.com/apis-docs/mlatka9/event-organizer/1.0)

## Jak uruchomić

W katalogu głównym projektu dodaj plik `.env` na podstawie pliku `.env.example`. Ma on zawierać zmienne środowiskowe 
- `DATABASE_URL` - link do bazy danych produkcyjnej
- `DATABASE_URL_TEST` - link do bazy danych testowej
- `JWT_SECRET` - klucz wykorzystywany do podpisywania tokenu JWT
- `NX_API_URL` - baza linku aplikacji serwerowej

- `npm install` - pobiera wymagane zależności do całego projektu

### Aplikacja serwerowa
- `npx prisma db push` - generuje tabele bazy danych na podstawie schematu prismy
- `npx nx serve server` - uruchamia aplikację

### Aplikacja kliencka
- `npx nx serve frontend` - uruchamia aplikację

### Testy jednostkowe aplikacji serwerowej
- `npx env-cmd -f .env.test` npx prisma db push - generuje tabele bazy danych na podstawie schematu prismy do bazy testowej
- `npx nx test server` - uruchamia zestaw wszystkich testów

### Testy e2e aplikacji klienckiej
- `npx nx serve server` - uruchom aplikację serwerową
- `npx nx e2e frontend-e2e` - uruchamia zestaw testów e2e

## Autor

Mateusz Łątka

github [@mlatka9](https://github.com/mlatka9)
