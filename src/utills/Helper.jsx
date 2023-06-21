export const isModerator = (keycloak) => {
  return  keycloak && 
  keycloak.tokenParsed && 
  keycloak.tokenParsed.resource_access && 
  keycloak.tokenParsed.resource_access.FoodRec.roles.includes('MODERATOR')
}

export const isMember = (keycloak) => {
  return  keycloak && 
  keycloak.tokenParsed && 
  keycloak.tokenParsed.resource_access && 
  keycloak.tokenParsed.resource_access.FoodRec.roles.includes('MEMBER')
}

export const handleLogError = (error) => {
  if (error.response) {
    console.log(error.response.data);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log(error.message);
  }
}

export function bearerAuth(token) {
  return `Bearer ${token}`;
}
