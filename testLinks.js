#!/usr/bin/env node

const process = require("process");
const chalk = require('chalk');
const fs = require('fs');
const pjson = require('./package.json');

const request = require('request');
const regex = /(https?)(:\/\/)([-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]+)/gi;

let fileName = process.argv.slice(2);

if (fileName.length < 1) {
    console.log('Help:');
    console.log('Input "testLinks v/version" in command line --- Check the command line tool version and name!');
    console.log('Input "testLinks [file name]" in command line --- finding and reporting dead links!');
    process.exit(1);
}
else {
    if (fileName[0] == "v" || fileName[0] == "version") {
        console.log("name: testLinks");
        console.log("version: " + pjson.version);
    }
    else {
        for (let i = 1; i <= fileName.length; i++) {
            try {
                let data = fs.readFileSync(fileName[i - 1], 'utf8');
                let urls = data.match(regex);

                if (urls) {
                    for (let u of urls) {
                        try {
                            request({url: u, method: 'HEAD'},(error,response)=>{
                                if(!error){
                                    if (response.statusCode == 200) {
                                        console.log(chalk.green(u + ' is good.'));
                                    }
                                    else if (response.statusCode == 400 || response.statusCode == 404) {
                                        console.log(chalk.red(u + ' is bad.'));  
                                    }
                                    else if (response.statusCode == 301 || response.statusCode == 307 || response.statusCode == 308){
                                        console.log(chalk.yellow(u + ' is redirect.')); 
                                    }
                                    else {
                                        console.log(chalk.gray(u + ' is unknow.'));
                                    }
                                }
                                else{
                                    console.log(chalk.gray(u + ' is unknow.'));
                                }
                            })
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                }
                else {
                    console.log("No suitable http(s) url.");
                }
            } catch (err) {
                console.log("File can not be found. Please try again!");               
            }
        }
    }
}






