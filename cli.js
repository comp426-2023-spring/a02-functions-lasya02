#!/usr/bin/env node

import minimist from "minimist";
import moment from 'moment-timezone';
import fetch from 'node-fetch';


var args = minimist(process.argv.slice(2));

const helpMenu = `
Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
`; 

if(args.h || args.help){
   
        console.log(helpMenu)
        process.exit(0.0)


}

const timezone = moment.tz.guess();
const latitude = args.n || (-1 * args.s);
const longitutde = args.e || (-1 * args.w);


    const APIresponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitutde + '&daily=sunrise,sunset,precipitation_hours&timezone=' + timezone)
    const APIdata = await APIresponse.json();

    if(args.j){
        console.log(APIdata);
        process.exit(0);
    }

    let days; 
    if (args.d == null) {days = 1}
    else {days = args.d}

    let printout = "The sun will rise at "
    printout += APIdata.daily.sunrise[days]
    printout += " and set at "
    printout += APIdata.daily.sunset[days]

    if (days > 1) { 
        printout += " in " + days + " days." 
    }
    else if (days == 0){ 
        printout += " today. "
    }
    else { printout += " tomorrow. "}

    if (APIdata.daily.precipitation_hours[days] != 0) {printout += "Be sure to pack an umbrella!"}
    else {printout += "Thankfully, it looks like there won't be rain. "}
    console.log(printout)






