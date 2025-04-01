// Получить параметры из URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    username: params.get("username") || "guest",
    color: params.get("color") || "green",
    speed: params.get("speed") || "1.0",
    ref: params.get("ref") || "",
    avatar_url: params.get("avatar_url"),
    team: params.get("team"),
    speed_x: params.get("speed_x"),
    speed_y: params.get("speed_y"),
    speed_z: params.get("speed_z"),
    rotation_x: params.get("rotation_x"),
    rotation_y: params.get("rotation_y"),
    rotation_z: params.get("rotation_z"),
    portal: params.get("portal") === "true",
  };
}

// Собрать параметры в строку
function buildQueryString(params: any) {
  const query = new URLSearchParams({
    username: params.username,
    color: params.color,
    speed: params.speed,
    ref: window.location.href, // ссылка на текущую игру
  });

  if (params.avatar_url) query.append("avatar_url", params.avatar_url);
  if (params.team) query.append("team", params.team);
  if (params.speed_x) query.append("speed_x", params.speed_x);
  if (params.speed_y) query.append("speed_y", params.speed_y);
  if (params.speed_z) query.append("speed_z", params.speed_z);
  if (params.rotation_x) query.append("rotation_x", params.rotation_x);
  if (params.rotation_y) query.append("rotation_y", params.rotation_y);
  if (params.rotation_z) query.append("rotation_z", params.rotation_z);

  return query.toString();
}

// 🚪 Функция: игрок входит в выходной портал (Vibeverse)
export function goToExitPortal() {
  const params = getQueryParams();
  const baseUrl = "http://portal.pieter.com";
  const query = buildQueryString(params);
  window.open(`${baseUrl}/?${query}`);
}

// 🔁 Функция: игрок возвращается назад в игру, из которой пришёл
export function returnToRefPortal() {
  const params = getQueryParams();
  if (!params.ref) {
    alert("No ref found. Cannot return.");
    return;
  }
  const query = buildQueryString(params);
  window.open(`${params.ref}?portal=true&${query}`);
}
