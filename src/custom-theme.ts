import { theme, ITheme, ColorHues } from '@chakra-ui/core/dist';

type CustomColors = ITheme['colors'] & {
  brand: ColorHues;
};

const brandColor: ColorHues = {
  50: '#ffe7e6',
  100: '#f8c1bd',
  200: '#ed9a93',
  300: '#e47268',
  400: '#db4b3e',
  500: '#c13124',
  600: '#97251b',
  700: '#6c1913',
  800: '#430d09',
  900: '#1d0100',
};

type CustomTheme = Omit<ITheme, 'colors'> & { colors: CustomColors };

const customTheme: CustomTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: brandColor,
  },
};

export default customTheme;
