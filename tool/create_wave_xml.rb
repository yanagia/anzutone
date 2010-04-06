require "base64"

templete=<<EOF
<?xml version="1.0" encoding="UTF-8" ?>
<Module>
  <ModulePrefs title="Anzutone" author="yanagia">
    <Require feature="wave" />
    <Require feature="dynamic-height" />
  </ModulePrefs>
  <Content type="html">
    <![CDATA[
<script type="text/javascript"
	src="http://wave-api.appspot.com/public/wave.js"></script>

#html_here

    ]]>
  </Content>
</Module>

EOF

f = open(ARGV.shift)
editor = f.read
f.close

f = open(ARGV.shift)
piano = f.read
f.close

publicurl = "http://anzutone.appspot.com/wave/"

editor.gsub!(/src="(.+?)"/, 'src="' + publicurl + '\1' + '"')
piano.gsub!(/src="(.+?)"/, 'src="' + publicurl + '\1' + '"')
editor.gsub!(/(css.+?href=")(.+?)"/, '\1' + publicurl + '\2' + '"')
piano.gsub!(/(css.+?href=")(.+?)"/, '\1' + publicurl + '\2' + '"')

# piano_b = 'data:text/html;charset=utf-8;base64,' + Base64.encode64(piano)
# editor.sub!(/(<iframe src=")(.+?)(")/, '\1' + piano_b + '\3')

templete.sub!(/#html_here/, editor)

print templete

# print piano
