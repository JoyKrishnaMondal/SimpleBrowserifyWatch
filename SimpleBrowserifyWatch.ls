Red = "\033[1;31m"
White = "\033[0;37m"
Green = "\033[1;32m"
LightGreen = "\033[0;32m"
Brown = "\033[0;33m"
Yellow = "\033[1;33m"

SimpleBrowserifyWatch = (Dependencies)->

	{browserify,_,cli,readline,chokidar} = Dependencies

	fs = require "fs"

	error = cli.redBright

	warn = cli.yellow

	success = cli.greenBright

	green = cli.green

	FileNames = process.argv.slice 2 # arguments are name of file

	# ------------------------------------- Take Input From User ( Check if the Arguments are Correct )

	Exit = -> console.error error "Exiting Program .. check docs for help."

	if FileNames[0] is undefined

		console.error error "Error: Source File is not specified."

		Exit!

		return

	if FileNames[1] is undefined

		StaticFileName = "static.js"

		console.error warn "Warning: Target File is not specified .. Setting #{StaticFileName} as Target."

		if fs.existsSync StaticFileName

			console.error warn "Warning : " + StaticFileName + " already exists."

		answer1 = readline.question Yellow + "Do you want to rewrite #{StaticFileName} (y/n) ? " + White

		switch answer1
		| "y" =>
			break
		| "n" =>
			StaticFileName = readline.question "Provide filename that browserify will use to save compiled file : " |> (.trim!)
		| otherwise =>
			console.error error "Error: answer is not recognized."
			Exit!

	else

		StaticFileName  = FileNames[1]

	# ------------------------------------- Done Taking Input From User
	Main.StaticFileName = StaticFileName
	Main.SourceFileName = FileNames[0]
	# ------------------------------------- Check If Input is Valid
	
	if not fs.existsSync Main.SourceFileName
		console.log error "Error: Source File #{Main.SourceFileName} does not exist."
		process.exit!

	# ------------------------------------- Check If Input is Valid
	Main.Repeats = 0

	log = (string,replace)->

		if replace == false
			console.log string
			return

		process.stderr.clearLine!
		process.stderr.cursorTo 0
		process.stderr.write string

		return

	TryCatchFn = (Fn) ->
		try
			Fn!
		catch Problem
			console.error error Problem
		return

	compile = (filename,CompiledName) ->

		b = browserify!

		b.require "./" + filename

		problem,buff <-! b.bundle

		if problem

			log problem
			return

		problem <-! fs.writeFile CompiledName,buff.toString!

		if problem
			console.error error problem

		if Main.Initial

			console.error success ".. done."
			Main.Initial = false
		else

			log warn "browserify|:" + success Main.Repeats + warn "|"+ success filename + (warn " > ") + (success CompiledName)

		Main.Repeats += 1

		return

	SetWatch = (filename,CompiledName) ->

		console.error (warn "Attempting compilation .. ") + Green + filename +  Brown  + " > " + Green + CompiledName

		try

			compile filename,CompiledName # runs browserify

		catch Problem
			console.log error Problem




		watcher = chokidar.watch filename
		
		watcher.on "change",-> 
			compile filename,CompiledName # runs browserify

		console.error LightGreen + "browserify watch for " + Green + filename  + LightGreen + " has being set .." + White

		return

	SetWatch Main.SourceFileName,Main.StaticFileName

	return # END OF MODULE

ListOfModules = ["browserify@4.0.0","prelude-ls","cli-color","readline-sync","chokidar"]

ListOfModuleNames = ["browserify","_","cli","readline","chokidar"]

spawn = (require "child_process").spawn

isWin = /^win/.test process.platform

if isWin
	NpmTerminal = "npm.cmd"
else
	NpmTerminal = "npm"

Main = {}

Main.CountOfRequiredModules = ListOfModules.length

Main.CountAlreadyInstalled = 0

PutRequiredModuleOnMain = ->

	try
		for I from 0 til ListOfModules.length
			eval "Main.#{ListOfModuleNames[I]} = require('#{ListOfModules[I]}')"
		return true
	catch Problem
		console.error Red + Problem + White
		return false

RunSpawn = (x) ->


	child = spawn NpmTerminal,["install",x]

	child.stdout.on "data",(data)->
		console.error data.toString!

	child.stderr.on "data",(data)->
		console.error data.toString!

	child.on "exit",->

		
		Main.CountAlreadyInstalled += 1
		console.log Yellow + "--------------------------------------" + White
		console.log LightGreen + "Installed : " + Green + x + White
		console.log Yellow +  "--------------------------------------" + White
		if Main.CountAlreadyInstalled is Main.CountOfRequiredModules
			console.error LightGreen + "All npm modules correctly installed" + White
			console.error LightGreen + "Please rerun SimpleBrowserifyWatch " + White
			# setTimeout (-> SimpleBrowserifyWatch Main), 2000

InstallAllModulesUsingNpm = -> 

	console.log Yellow + "Node modules possibly not installed .." + White
	console.log Yellow + "Attemping to install/reinstall ALL dependencies .." + White

	try

		for I from 0 til ListOfModules.length

			RunSpawn ListOfModules[I]

		return true

	catch problem
		console.error Red + problem + White
		return false



Success = PutRequiredModuleOnMain!

if Success
	SimpleBrowserifyWatch Main
else
	InstallAllModulesUsingNpm!