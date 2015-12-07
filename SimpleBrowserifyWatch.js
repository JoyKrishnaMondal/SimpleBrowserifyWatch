// Generated by LiveScript 1.4.0
(function(){
  var Red, White, Green, LightGreen, Brown, Yellow, SimpleBrowserifyWatch, ListOfRequires, ExecInstallArg, ListOfModuleNames, spawn, isWin, NpmTerminal, Main, PutRequiredModuleOnMain, RunSpawn, InstallAllModulesUsingNpm, Success;
  Red = "\x1b[1;31m";
  White = "\x1b[0;37m";
  Green = "\x1b[1;32m";
  LightGreen = "\x1b[0;32m";
  Brown = "\x1b[0;33m";
  Yellow = "\x1b[1;33m";
  SimpleBrowserifyWatch = function(Dependencies){
    var browserify, _, cli, readline, chokidar, fs, error, warn, success, green, FileNames, Exit, StaticFileName, answer1, log, TryCatchFn, compile, SetWatch;
    browserify = Dependencies.browserify, _ = Dependencies._, cli = Dependencies.cli, readline = Dependencies.readline, chokidar = Dependencies.chokidar;
    fs = require("fs");
    error = cli.redBright;
    warn = cli.yellow;
    success = cli.greenBright;
    green = cli.green;
    FileNames = process.argv.slice(2);
    Exit = function(){
      return console.error(error("Exiting Program .. check docs for help."));
    };
    if (FileNames[0] === undefined) {
      console.error(error("Error: Source File is not specified."));
      Exit();
      return;
    }
    if (FileNames[1] === undefined) {
      StaticFileName = "static.js";
      console.error(warn("Warning: Target File is not specified .. Setting " + StaticFileName + " as Target."));
      if (fs.existsSync(StaticFileName)) {
        console.error(warn("Warning : " + StaticFileName + " already exists."));
      }
      answer1 = readline.question(Yellow + ("Do you want to rewrite " + StaticFileName + " (y/n) ? ") + White);
      switch (answer1) {
      case "y":
        break;
      case "n":
        StaticFileName = function(it){
          return it.trim();
        }(
        readline.question("Provide filename that browserify will use to save compiled file : "));
        break;
      default:
        console.error(error("Error: answer is not recognized."));
        Exit();
      }
    } else {
      StaticFileName = FileNames[1];
    }
    Main.StaticFileName = StaticFileName;
    Main.SourceFileName = FileNames[0];
    if (!fs.existsSync(Main.SourceFileName)) {
      console.log(error("Error: Source File " + Main.SourceFileName + " does not exist."));
      process.exit();
    }
    Main.Repeats = 0;
    log = function(string, replace){
      if (replace === false) {
        console.log(string);
        return;
      }
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(string);
    };
    TryCatchFn = function(Fn){
      var Problem;
      try {
        Fn();
      } catch (e$) {
        Problem = e$;
        console.error(error(Problem));
      }
    };
    compile = function(filename, CompiledName){
      var b;
      b = browserify();
      b.require("./" + filename);
      return b.bundle(function(problem, buff){
        if (problem) {
          log(error(problem.toString()));
          return;
        }
        fs.writeFile(CompiledName, buff.toString(), function(problem){
          if (problem) {
            console.error(error(problem));
          }
          if (Main.Initial) {
            console.error(success(".. done."));
            Main.Initial = false;
          } else {
            log(warn("browserify|:" + success(Main.Repeats + warn("|" + success(filename + warn(" > ") + success(CompiledName))))));
          }
          Main.Repeats += 1;
          return;
        });
      });
    };
    SetWatch = function(filename, CompiledName){
      var Problem, watcher;
      console.error(warn("Attempting compilation .. ") + Green + filename + Brown + " > " + Green + CompiledName);
      try {
        compile(filename, CompiledName);
      } catch (e$) {
        Problem = e$;
        console.log(error(Problem));
      }
      watcher = chokidar.watch(filename);
      watcher.on("change", function(){
        return compile(filename, CompiledName);
      });
      console.error(LightGreen + "browserify watch for " + Green + filename + LightGreen + " has being set .." + White);
    };
    SetWatch(Main.SourceFileName, Main.StaticFileName);
  };
  ListOfRequires = ["browserify", "prelude-ls", "cli-color", "readline-sync", "chokidar"];
  ExecInstallArg = ["browserify@4.0.0", "prelude-ls", "cli-color", "readline-sync", "chokidar"];
  ListOfModuleNames = ["browserify", "_", "cli", "readline", "chokidar"];
  spawn = require("child_process").spawn;
  isWin = /^win/.test(process.platform);
  if (isWin) {
    NpmTerminal = "npm.cmd";
  } else {
    NpmTerminal = "npm";
  }
  Main = {};
  Main.CountOfRequiredModules = ListOfModuleNames.length;
  Main.CountAlreadyInstalled = 0;
  PutRequiredModuleOnMain = function(){
    var i$, to$, I, Problem;
    try {
      for (i$ = 0, to$ = ListOfModuleNames.length; i$ < to$; ++i$) {
        I = i$;
        eval("Main." + ListOfModuleNames[I] + " = require('" + ListOfRequires[I] + "')");
      }
      return true;
    } catch (e$) {
      Problem = e$;
      console.error(Red + Problem + White);
      return false;
    }
  };
  RunSpawn = function(x){
    var child;
    child = spawn(NpmTerminal, ["install", x]);
    child.stdout.on("data", function(data){
      return console.error(data.toString());
    });
    child.stderr.on("data", function(data){
      return console.error(data.toString());
    });
    return child.on("exit", function(){
      Main.CountAlreadyInstalled += 1;
      console.log(Yellow + "--------------------------------------" + White);
      console.log(LightGreen + "Installed : " + Green + x + White);
      console.log(Yellow + "--------------------------------------" + White);
      if (Main.CountAlreadyInstalled === Main.CountOfRequiredModules) {
        console.error(LightGreen + "All npm modules correctly installed" + White);
        return console.error(LightGreen + "Please rerun SimpleBrowserifyWatch " + White);
      }
    });
  };
  InstallAllModulesUsingNpm = function(){
    var i$, to$, I, problem;
    console.log(Yellow + "Node modules possibly not installed .." + White);
    console.log(Yellow + "Attemping to install/reinstall ALL dependencies .." + White);
    try {
      for (i$ = 0, to$ = ExecInstallArg.length; i$ < to$; ++i$) {
        I = i$;
        RunSpawn(ExecInstallArg[I]);
      }
      return true;
    } catch (e$) {
      problem = e$;
      console.error(Red + problem + White);
      return false;
    }
  };
  Success = PutRequiredModuleOnMain();
  if (Success) {
    SimpleBrowserifyWatch(Main);
  } else {
    InstallAllModulesUsingNpm();
  }
}).call(this);
