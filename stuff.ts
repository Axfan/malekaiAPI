export class RawComponent {
  data_type: string; // generated as 'raw_component'
  id: string;

  name: string;
  icon: string;
  description: string;

  variants: {
    name: string;
    icon: string;
    description: string;
  }[];
}

// in the "components" db table
export class Recipe {
  data_type: string; // generated as 'recipe'
  id: string; // generated from name

  name: string; // component name
  icon: string;
  description: string;

  profession: string; // blacksmith, etc
  category: string; // recipe category

  // https://cdn.discordapp.com/attachments/315296005279186946/321072806408224768/unknown.png

  assembly_stat: string; // i.e. "crafting basics", something to do with skills. we don't have this info either
  duration: number; // seconds, default to 0 because we have none of that info

  success_chance: number; // success chance
  difficulty: number; // difficulty rating

  components: {
    name: string; // other components/recipes or raw components
    amount: number;
    required: boolean;
  } [];

  variants: { // crafted outputs (recorded by hand - thanks CytheS!)
    name: string;
    attribute: string;
    impact: number; // measured data
    components: {
      name: string;
      amount: number;
    } [];
  } [];
}
