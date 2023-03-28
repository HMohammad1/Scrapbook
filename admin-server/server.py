# A small flask server to allow remote control of the main server

from os import getcwd
from os.path import join
from flask import Flask, request
import subprocess
import json
import time
import datetime
import sys

WRITE_LOGS = True

for arg in sys.argv:
	if arg.lower() == "--nologs":
		WRITE_LOGS = False
		print("no logs")

app = Flask(__name__)

main_folder = join(getcwd(), "../")
scripts_folder = join(getcwd(), "scripts/")
logs_folder = join(getcwd(), "logs/")

server_running = False

def writeLog(file_suffix, contents, file_type=".log"):
	if not WRITE_LOGS: return

	timestamp = datetime.datetime.now().isoformat()
	filename = timestamp + " " + file_suffix + file_type
	logfile = open(join(logs_folder, filename), "w")
	logfile.write(contents)
	logfile.close()

@app.route("/")
def index_page():
	pagef = open('index.html', 'r')
	page = pagef.read()
	pagef.close()

	return page, 200, {'Content-Type': 'text/html'}

@app.route("/api/serverstart")
def serverstart():
	global server_running

	if server_running:
		return json.dumps({"msg": "Server already running"}), 200, {'Content-Type': 'application/json'}

	subprocess.run(["./start_server.sh"], cwd=scripts_folder)

	server_running = True
	print("Started server")
	return json.dumps({"msg": "Server started"}), 200, {'Content-Type': 'application/json'}

@app.route("/api/serverstop")
def serverstop():
	global server_running

	if not server_running:
		return json.dumps({"msg": "Server not running"}), 200, {'Content-Type': 'application/json'}

	subprocess.run(["./stop_server.sh"], cwd=scripts_folder)

	server_running = False
	print("Stopped server")
	return json.dumps({"msg": "Server stopped"}), 200, {'Content-Type': 'application/json'}

@app.route("/api/serverrestart")
def serverrestart():
	global server_running

	if server_running:
		print("Stopping server for restart...")
		subprocess.run(["./stop_server.sh"], cwd=scripts_folder, capture_output=True)

		while server_running:
			print("Waiting for server to shut down...")
			isServerRunning()
			time.sleep(1)

	return serverstart()

def isServerRunning():
	global server_running

	res = subprocess.run("screen -ls | grep scrapmap-main", shell=True, capture_output=True)

	# Return code 0 means grep did not fail, therefor the screen exists and the server is running
	server_running = res.returncode == 0

	return server_running

@app.route("/api/serverrunning")
def serverrunning():
	global server_running

	isServerRunning()

	return json.dumps({"running": server_running}), 200, {'Content-Type': 'application/json'}

@app.route("/api/gitpull")
def gitpull():
	res = subprocess.run(["git", "pull"], capture_output=True)

	msg = res.stdout.decode('utf-8').replace('\n', '<br>')

	print("Git pull:")
	print(msg)

	writeLog("git_pull", res.stdout.decode('utf-8'))

	return json.dumps({"msg": msg}), 200, {'Content-Type': 'application/json'}

@app.route("/api/gitstatus")
def gitstatus():
	res = subprocess.run(["git", "status"], capture_output=True)

	msg = res.stdout.decode('utf-8').replace('\n', '<br>')

	print("Git status:")
	print(msg)

	writeLog("git_status", res.stdout.decode('utf-8'))

	return json.dumps({"msg": msg}), 200, {'Content-Type': 'application/json'}

@app.route("/api/dbexecute")
def dbexecute():
	sql = request.args.get('sql')

	print("DB Execute:")
	print(sql)

	res = subprocess.run(["mysql -uscrapmap -pasdf scrapmap -e \"" + sql + "\""], shell=True, capture_output=True)
	# res = subprocess.run(["ls /"], shell=True, capture_output=True)

	print("mysql output:")
	print(res.stdout.strip())

	# Remove quotation marks from sql
	if sql[0] == '"': sql = sql[1:]
	if sql[-1] == '"': sql = sql[:-1]

	writeLog("sql_execute", "## SQL Input:\n```sql\n%s\n```\n## MySQL Output:\n```\n%s\n```" % (sql, res.stdout.decode('utf-8')), ".md")

	return json.dumps({"msg": res.stdout.decode('utf-8').replace('\n', '<br>')}), 200, {'Content-Type': 'application/json'}


# Start server
if __name__ == "__main__":
	app.run(host="0.0.0.0", port=3100, debug=False)
