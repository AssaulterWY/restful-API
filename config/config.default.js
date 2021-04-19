module.exports = appInfo => {
    const config = exports = {};

    config.keys = "wangyao-secert";

    config.view = {
      mapping: {
        '.html':'ejs',
      },
    };

    config.validate = {
      // convert: false,
      // validateRoot: false,
    };

    config.security = {
      csrf: {
        enable: false,
      },
    };

    //config.middleware = ['auth'];

    return config;
};