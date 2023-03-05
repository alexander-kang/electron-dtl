module.exports = {
  packagerConfig: {
    executableName: 'FileDistributionGUI',
    icon: 'nu.ico'
  },
  rebuildConfig: {},
  makers: [
    // For Windows
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupExe: 'FileDistributionGUI.exe'
      },
    },
    // For .zip's
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    // For Debian-based Linux distros
    // {
    //   name: '@electron-forge/maker-deb',
    //   config: {
    //     options: {
    //       icon: 'nu.jpeg'
    //     }
    //   },
    // },
    // For RedHat-based Linux distros
    // {
    //   name: '@electron-forge/maker-rpm',
    //   config: {
    //     options: {
    //       icon: 'nu.jpeg'
    //     }
    //   },
    // },
    // For macOS
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     icon: 'nu.jpeg'
    //   },
    // },
  ],
};
