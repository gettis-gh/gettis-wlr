const { lua, lauxlib, lualib, to_luastring, to_jsstring } = fengari;

const outputArea = document.getElementById("outputArea");
const luaCodeInput = document.getElementById("luaCodeInput");
const runLuaButton = document.getElementById("runLuaButton");

luaCodeInput.value = `print("Hello from Lua!")`;

function luaPrintOverride(luaState) {
  const argumentCount = lua.lua_gettop(luaState);
  const output = [];
  for (let i = 1; i <= argumentCount; i++) {
    output.push(to_jsstring(lua.lua_tolstring(luaState, i)));
  }
  outputArea.textContent += output.join("\t") + "\n";
  return 0;
}

function executeLuaCode(luaCode) {
  const luaState = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(luaState);

  lua.lua_pushjsfunction(luaState, luaPrintOverride);
  lua.lua_setglobal(luaState, to_luastring("print"));

  const loadStatus = lauxlib.luaL_loadstring(luaState, to_luastring(luaCode));
  if (loadStatus === lua.LUA_OK) {
    lua.lua_pcall(luaState, 0, lua.LUA_MULTRET, 0);
  } else {
    const errorMsg = to_jsstring(lua.lua_tostring(luaState, -1));
    outputArea.textContent += "Error: " + errorMsg + "\n";
  }
}

runLuaButton.onclick = () => {
  outputArea.textContent = "";
  executeLuaCode(luaCodeInput.value);
};
