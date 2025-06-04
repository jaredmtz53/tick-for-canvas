type Theme = {
  name: string;
  className: string;
  colors: {
    accent: string;
    background: string;
  };
  image: string;
};

export const themes: Theme[] = [
  {
    name: "Avacado",
    className: "theme-avocado",
    colors: {
      accent: "#29911b",
      background: "#a8d44b",
    },
    image: "/assets/themes/avocado.png",
  },
  {
    name: "Lemon",
    className: "theme-lemon",
    colors: {
      accent: "#f4cd30",
      background: "#ffe637",
    },
    image: "/assets/themes/lemon.png",
  },
  {
    name: "blueberry",
    className: "theme-blueberry",
    colors: {
      accent: "#4a90e2",
      background: "#d0e1f9",
    },
    image: "/assets/themes/blueberry.png",
  },
  {
    name: "grape",
    className: "theme-grape",
    colors: {
      accent: "#6f2c91",
      background: "#d6cce0",
    },
    image: "/assets/themes/grape.png",
  },
  {
    name: "tomato",
    className: "theme-tomato",
    colors: {
      accent: "#ff6347",
      background: "#ff7f50",
    },
    image: "/assets/themes/tomato.png",
  },
];
