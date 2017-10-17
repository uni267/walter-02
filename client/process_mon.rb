require "pp"
require "open3"

cmd = [
  "ps aux",
  "grep react-scripts",
  "grep start",
  "grep -v grep"
]

out, err, status = Open3.capture3 cmd.join("|")

rows = out.split("\n").map {|row| row.split(" ").last }

if rows.size === 0
  pkg_json = File.expand_path "../", __FILE__
  Open3.capture3 "cd #{pkg_json} && npm start"
end

