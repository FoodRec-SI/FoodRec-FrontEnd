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