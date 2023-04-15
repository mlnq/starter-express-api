const rateLimit = require('express-rate-limit');
const User = require("../models/user.model");


const maxLoginAttempts = 5;
const initialDelay = 0; // początkowe opóźnienie wynosi 1 sekundę
let delay = initialDelay;
const updateLoginAttempts = (req, res, next) => {
    const {username, password} = req.body;
    User.findOne({username}, (err, user) => {
        if (err) {
            return next(err);
        }
        // Sprawdź, czy konto użytkownika jest zablokowane
        const blockedFlag = user.blockedUntil && user.blockedUntil > new Date();
        if (blockedFlag) {
            // delay = (new Date(user.blockedUntil) - new Date();
            const secondsLeft = Math.round((new Date(user.blockedUntil) - new Date()) / 1000);
            delay = secondsLeft;

            return res.status(429).send('Blocked: Twoje konto jest zablokowane. Spróbuj ponownie później.' + secondsLeft + 's');
        }
        if (!user) {
            // nieprawidłowy username
            if (!blockedFlag) {
                delay += 1000 * user.loginAttempts;
                user.blockedUntil = new Date(Date.now() + delay);
                user.loginAttempts += 1;
                user.lastFailedLogin = Date.now();
                user.save();
                const secondsLeft = Math.round((new Date(user.blockedUntil) - new Date()) / 1000);
                return res.status(401).send(`Nieprawidłowy login lub hasło.`);
            }

        }
        if (user.loginAttempts >= maxLoginAttempts) {
            if (!blockedFlag) {
                delay += 1000 * 60 * 60; // dodajemy 1 sekundę do opóźnienia
                user.blockedUntil = new Date(Date.now() + delay);
                user.loginAttempts = 0;
                user.lastFailedLogin = Date.now();
                user.save();
                const secondsLeft = Math.round((new Date(user.blockedUntil) - new Date()) / 1000);
                return res.status(429).send(`Błędne dane. Twoje konto zostało zablokowane na ${secondsLeft} sekund`);
            }
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return next(err);
            }
            // nieprawidłowe hasło
            if (!blockedFlag && !isMatch) {
                delay += 1000 * user.loginAttempts; // dodajemy 1 sekundę do opóźnienia
                user.blockedUntil = new Date(Date.now() + delay);
                user.loginAttempts += 1;
                user.lastFailedLogin = Date.now();
                user.save();
                const secondsLeft = Math.round((new Date(user.blockedUntil) - new Date()) / 1000);
                return res.status(401).send(`Twoje konto zostało zablokowane na ${secondsLeft} sekund`);
                // return res.status(401).send('Nieprawidłowy username lub hasło');
            }
            // poprawne logowanie
            req.session.loginAttempts = 0;
            req.session.lastSuccessfulLogin = Date.now();
            user.loginAttempts = 0;
            user.lastSuccessfulLogin = Date.now();
            user.save();
            delay = initialDelay; // resetujemy opóźnienie do wartości początkowej
            next();
        });
    });
};

// const limiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 godzina
//     max: 5, // maksymalnie 5 żądań na godzinę
//     delayMs: 0, // początkowe opóźnienie między żądaniami
//     message: 'Przekroczono limit liczby żądań, spróbuj ponownie później'
// });

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 godzina
    max: 5, // maksymalnie 5 żądań na godzinę
    delayMs: 0, // początkowe opóźnienie między żądaniami wynosi 0
    delayAfter: 1, // zwiększaj opóźnienie co drugie żądanie
    message: "Przekroczono limit liczby żądań, spróbuj ponownie później",
    // skip: (req, res) => {
    //     // Pomijaj opóźnienie dla nieautoryzowanych żądań
    //     return !req.user;
    // },
});
// const updateLoginAttempts = async (req, res, next) => {
//     const {username, password} = req.body;
//     const user = await User.findOne({username});
//
//     // Sprawdź, czy użytkownik istnieje w bazie danych
//     if (!user) {
//         return res.status(400).send('Nieprawidłowa nazwa użytkownika lub hasło');
//     }
//
//     // Sprawdź, czy konto użytkownika jest zablokowane
//     if (user.blockedUntil && user.blockedUntil > new Date()) {
//         return res.status(400).send('Twoje konto jest zablokowane. Spróbuj ponownie później.');
//     }
//
//     // Sprawdź, czy hasło jest prawidłowe
//     const isPasswordValid = await user.comparePassword(password);
//
//     // Jeśli hasło jest nieprawidłowe, zwiększ liczbę nieudanych prób logowania
//     // i ustaw datę ostatniej nieudanej próby logowania.
//     if (!isPasswordValid) {
//         user.loginAttempts += 1;
//         user.lastFailedLogin = new Date();
//
//         // Sprawdź, czy liczba nieudanych prób logowania przekroczyła maksymalną wartość
//         if (user.loginAttempts >= maxLoginAttempts) {
//             // Jeśli tak, zablokuj konto użytkownika na 1 minutę od ostatniej nieudanej próby logowania
//             user.blockedUntil = new Date(Date.now() + 1 * 60 * 1000);
//             // user.loginAttempts = 0;
//             return res.status(429).send('Twoje konto jest zablokowane. Spróbuj ponownie później.');
//         }
//     } else {
//         // Jeśli hasło jest prawidłowe, zresetuj liczbę nieudanych prób logowania
//         // i ustaw datę ostatniej udanej próby logowania.
//         user.loginAttempts = 0;
//         user.lastSuccessfulLogin = new Date();
//     }
//
//     user.comparePassword(password, (err, isMatch) => {
//         if (err) {
//             return next(err);
//         }
//         if (!isMatch) {
//             // nieprawidłowe hasło
//             // Jeśli hasło jest nieprawidłowe, zwiększ liczbę nieudanych prób logowania
//             user.loginAttempts += 1;
//             // ustaw datę ostatniej nieudanej próby logowania.
//             user.lastFailedLogin = Date.now();
//             user.save();
//
//             if (user.failedAttempts > maxLoginAttempts) {
//                 // zablokuj konto użytkownika na 1 godzine od ostatniej nieudanej próby logowania
//                 user.blockedUntil = new Date(Date.now() + 60 * 60 * 1000);
//                 user.save();
//                 return res.status(429).send('Twoje konto zostało zablokowane na minutę');
//             } else {
//                 user.blockedUntil = new Date(Date.now() + user.loginAttempts * 60 * 1000);
//                 return res.status(429).send('Twoje konto zostało zablokowane na ' + user.loginAttempts * 60 + 'sekund');
//
//             }
//             return res.status(401).send('Nieprawidłowy username lub hasło');
//         }
//         // poprawne logowanie
//         req.session.loginAttempts = 0;
//         req.session.lastSuccessfulLogin = Date.now();
//         user.loginAttempts = 0;
//         user.lastSuccessfulLogin = Date.now();
//         user.save();
//         next();
//     });
//
// };
// const updateLoginAttempts = (req, res, next) => {
//     const {username, password} = req.body;
//     User.findOne({username}, (err, user) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             // nieprawidłowy username
//             delay += 1000; // dodajemy 1 sekundę do opóźnienia
//             return res.status(401).send('Nieprawidłowy login lub hasło');
//         }
//         // if (user.loginAttempts >= maxLoginAttempts) {
//         //     // konto zostało zablokowane
//         //     const remainingTime = Math.ceil((user.blockExpires - Date.now()) / 1000 / 60); // pozostały czas w minutach
//         //     return res.status(429).send(`Twoje konto zostało zablokowane na ${remainingTime} minut`);
//         // }
//         user.comparePassword(password, (err, isMatch) => {
//             if (err) {
//                 return next(err);
//             }
//             if (!isMatch) {
//                 // nieprawidłowe hasło
//                 user.loginAttempts += 1;
//                 user.lastFailedLogin = Date.now();
//                 user.save();
//
//                 if (user.failedAttempts >= 5) {
//                     delay = now + 60000; // blokada na minutę
//                     user.save();
//                     return res.status(429).send('Twoje konto zostało zablokowane na minutę');
//                 }
//                 delay += 1000; // dodajemy 1 sekundę do opóźnienia
//                 delay = Math.min(delay, maxDelay); // ograniczamy opóźnienie do maksymalnej wartości
//                 return res.status(401).send('Nieprawidłowy username lub hasło');
//             }
//             // poprawne logowanie
//             req.session.loginAttempts = 0;
//             req.session.lastSuccessfulLogin = Date.now();
//             user.loginAttempts = 0;
//             user.lastSuccessfulLogin = Date.now();
//             user.save();
//             delay = initialDelay; // resetujemy opóźnienie do wartości początkowej
//             next();
//         });
//     });
// };
module.exports = {updateLoginAttempts, limiter};
// const rateLimit = require('express-rate-limit');
// const User = require("../models/user.model");
//
//
// const maxLoginAttempts = 5;
// const initialDelay = 1000; // początkowe opóźnienie wynosi 1 sekundę
// const maxDelay = 10000; // maksymalne opóźnienie wynosi 10 sekund
//
// let delay = initialDelay;
// const limiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 godzina
//     max: 5, // maksymalnie 5 żądań na godzinę
//     message: 'Przekroczono limit liczby żądań, spróbuj ponownie później'
// });
//
// const updateLoginAttempts = (req, res, next) => {
//     const {username, password} = req.body;
//     User.findOne({username}, (err, user) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             // nieprawidłowy email
//             delay += 1000; // dodajemy 1 sekundę do opóźnienia
//             delay = Math.min(delay, maxDelay); // ograniczamy opóźnienie do maksymalnej wartości
//             return res.status(401).send('Nieprawidłowy username lub hasło');
//         }
//         if (user.loginAttempts >= maxLoginAttempts) {
//             // konto zostało zablokowane
//             const remainingTime = Math.ceil((user.blockExpires - Date.now()) / 1000 / 60); // pozostały czas w minutach
//             return res.status(429).send(`Twoje konto zostało zablokowane na ${remainingTime} minut`);
//         }
//         user.comparePassword(password, (err, isMatch) => {
//             if (err) {
//                 return next(err);
//             }
//             if (!isMatch) {
//                 // nieprawidłowe hasło
//                 user.loginAttempts += 1;
//                 user.lastFailedLogin = Date.now();
//                 user.save();
//
//                 delay += 1000; // dodajemy 1 sekundę do opóźnienia
//                 delay = Math.min(delay, maxDelay); // ograniczamy opóźnienie do maksymalnej wartości
//                 return res.status(401).send('Nieprawidłowy username lub hasło');
//             }
//             // poprawne logowanie
//             req.session.loginAttempts = 0;
//             req.session.lastSuccessfulLogin = Date.now();
//             user.loginAttempts = 0;
//             user.lastSuccessfulLogin = Date.now();
//             user.save();
//             delay = initialDelay; // resetujemy opóźnienie do wartości początkowej
//             next();
//         });
//     });
// };
//
// module.exports = {updateLoginAttempts, limiter};
