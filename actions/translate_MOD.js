module.exports = {
  name: 'Translate',
  section: 'Other Stuff',

  subtitle (data) {
    return `Translate to [${data.translateTo}]`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Translated String'
    return ([data.varName, dataType])
  },

  fields: ['translateTo', 'translateMessage', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
	<div style="float: right; width: 60%;">
		Translate to:<br>
		<input id="translateTo" placeholder="Should be 2 letters." class="round" type="text" maxlength="2"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Translate Message:<br>
	<textarea id="translateMessage" rows="9" placeholder="Insert message that you want to translate here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const _this = this
    const data = cache.actions[cache.index]
    const translateTo = this.evalMessage(data.translateTo, cache)
    const translateMessage = this.evalMessage(data.translateMessage, cache)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)

    if (!translateTo || translateTo.length > 2) return console.log('Translate to can only be 2 letters.')
    if (!translateMessage) return console.log('You need to write something to translate.')

    const Mods = this.getMods()
    const translate = Mods.require('node-google-translate-skidz')

    translate({
      text: translateMessage,
      target: translateTo
    }, (result) => {
      if (result.translation !== undefined) {
        _this.storeValue(result.translation, storage, varName, cache)
      }
      _this.callNextAction(cache)
    })
  },

  mod () {}

}
