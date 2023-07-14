/*
Basically put all the variables that should be constants and should be reuse across the projects.
And the goal of having this file with all these variables is that it will allow us to easily 
configure or project by simply changing some of the data that is here in this configuration file.

So therefore the name of config.

Of course we will not want to put all the variables here in this file. The only variables that we 
do want here are the ones that are responsible for kind of defining some important data
about the application itself. So one example of that is for example, the API URL.
*/

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const API_KEY = '7faa10dc-84ed-47e3-87b6-ea14790932cd';
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const MODEL_CLOSE_SEC = 2.5;