import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const facts = [
  "Birds are the only living dinosaurs.",
  "A bird's heart beats 400 times per minute while resting. prety cool right?",
  "The Bee Hummingbird is the smallest bird in the world.",
  "Eagles can see up to 3 kilometers away.",
  "Ostriches can run faster than horses.",
  "A group of flamingos is called a 'flamboyance.'",
  "Some species of birds can live for over 60 years.",
  "The albatross can fly for hours without flapping its wings.",
  "Owls can turn their heads up to 270 degrees.",
  "Penguins are excellent swimmers but cannot fly.",
  "The fastest bird in the world is the peregrine falcon, reaching speeds of over 240 mph during a dive.",
  "The Arctic Tern migrates 70,000 kilometers every year, making it the longest migratory bird.",
  "Some birds can mimic human speech, such as parrots and mynas.",
  "Hummingbirds can hover in mid-air by rapidly flapping their wings in a figure-eight motion.",
  "The Kakapo is a flightless parrot from New Zealand, and it is critically endangered.",
  "A raven can imitate the calls of other animals, including wolves and dogs.",
  "The average lifespan of a pigeon is 3 to 5 years in the wild.",
  "Peacocks are known for their vibrant tail feathers, which they display during courtship rituals.",
  "The male lyrebird can mimic the sounds of chainsaws, camera shutters, and even car alarms.",
  "Chuck-will's-widow is a nocturnal bird that belongs to the nightjar family and is named after its distinctive call.",
  "Brandt's Cormorant has a bright blue throat patch and is often seen diving for fish along the Pacific coast.",
  "The Red-faced Cormorant has a bright red face and is found along the rocky coasts of Alaska and Russia.",
  "The Pelagic Cormorant is known for its slender body and striking greenish-black plumage, often seen on coastal waters.",
  "The Bronzed Cowbird is a parasitic bird that lays its eggs in the nests of other birds, often in open grasslands.",
  "The Shiny Cowbird has a glossy black plumage and is often seen near livestock in pastures and agricultural areas.",
  "The Brown Creeper is a small bird that climbs tree trunks in search of insects and spiders.",
  "The American Crow is known for its intelligence and ability to use tools, and it often travels in large groups.",
  "The Fish Crow prefers coastal habitats and is often found in wetlands and estuaries.",
  "The Black-billed Cuckoo has a distinctive long tail and often hides among dense foliage in wooded areas.",
  "The Mangrove Cuckoo is found in mangrove forests and is known for its secretive nature and distinctive call.",
  "The Yellow-billed Cuckoo is often spotted in forests and woodlands and is recognized by its bright yellow bill.",
  "The Gray-crowned Rosy Finch has a distinctive rosy pink hue on its wings and tail, often seen in alpine habitats.",
  "The Purple Finch is known for its vibrant plumage, with the males displaying deep magenta coloration.",
  "The Northern Flicker is a type of woodpecker known for its distinctive 'flickering' flight pattern and call.",
  "The Acadian Flycatcher is a small songbird found in wooded areas and is known for its high-pitched call.",
  "The Great Crested Flycatcher is recognized by its large, crested head and yellow belly, often found in forests.",
  "The Least Flycatcher is a small, active bird that flits around searching for insects in forest habitats.",
  "The Olive-sided Flycatcher is named for its olive-green plumage and is often found in coniferous forests.",
  "The Horned Grebe has distinctive golden plumes on its head during the breeding season.",
  "The Pied-billed Grebe is known for its distinctive, thick bill with a black ring around it.",
  "The Western Grebe is famous for its elegant, synchronized courtship dance, often seen on lakes and marshes.",
  "The Blue Grosbeak is a large finch with striking blue feathers and is found in open woodlands and grasslands.",
  "The Evening Grosbeak has a bright yellow and black coloration, often spotted in coniferous forests during winter.",
  "The Pine Grosbeak is a large, colorful bird with a preference for coniferous forests and berry-rich habitats.",
  "The Rose-breasted Grosbeak is known for its striking black-and-white plumage and a rose-red patch on its chest.",
  "The Pigeon Guillemot is a seabird that nests in coastal cliffs and has striking black and white plumage.",
  "The California Gull is known for its role in helping control the population of invasive species in the western United States.",
  "The Glaucous-winged Gull is easily recognized by its large size and pale-colored wings, often seen on the Pacific coast."
];

export const BirdFacts = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 max-w-xl mx-auto"
    >
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Did You Know?</h3>
        </div>
        <p className="text-gray-700 italic">
          {facts[Math.floor(Math.random() * facts.length)]}
        </p>
      </div>
    </motion.div>
  );
};
