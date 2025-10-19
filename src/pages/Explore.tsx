import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const destinationsInfo = {
  chichiriviche: {
    es: {
      title: "Chichiriviche",
      description: "Ubicado en el estado Falcón, Chichiriviche es el vibrante pueblo costero y la puerta de entrada principal al Parque Nacional Morrocoy. Este es un verdadero paraíso costero que ofrece algunas de las playas más hermosas de Venezuela. Sus aguas cristalinas, arena blanca y cayos paradisíacos lo convierten en un destino perfecto para los amantes del mar, la fauna y el sol.",
      culture:[`Más allá de sus famosos cayos, Chichiriviche es un pueblo costero con una identidad propia, forjada por el mar y la actividad turística. Su cultura es un reflejo de la vida caribeña: vibrante, relajada y muy enfocada en la hospitalidad.`,
              `Aunque el turismo es el motor actual, la pesca artesanal sigue siendo parte vital de la identidad del pueblo. Los lancheros y los guías locales tienen un conocimiento profundo del mar y del Parque Nacional Morrocoy, que ha sido transmitido por generaciones de pescadores. Esta conexión con el mar asegura que los servicios de lancha sean auténticos y manejados por quienes mejor conocen la zona.
`
              ],
      
      attractions: [
        `Las estrellas de Morrocoy son sus cayos, pequeñas islas coralinas de arena blanca, rodeadas de un mar de intensos tonos azules y turquesas. Los cayos mas destacados son los siguientes:`,
        `Cayo Sombrero 
 Es el cayo más famoso y popular. Se caracteriza por su frondosa vegetación de palmeras que llegan hasta la orilla, ofreciendo una sombra natural ideal.`,
        `Cayo Sal 
 Un cayo más pequeño y rústico, conocido por la presencia de una salina natural que le da su nombre. Es menos concurrido que Cayo Sombrero.`,
        `Cayo Peraza 
 Famoso por sus bancos de arena que emergen y crean extensas piscinas naturales de agua muy baja. Es un lugar perfecto para que las lanchas se anclen.`,
        `Cayo Muerto 
 A pesar de su nombre, es un cayo lleno de vida. Suele tener aguas muy calmadas y poco profundas cerca de la orilla.`
      ],
      history: [`Un Pueblo de Pescadores`,
`Durante siglos, la economía local se basó en una combinación de la pesca artesanal y la explotación de la sal. Los habitantes desarrollaron un profundo conocimiento del ecosistema marino y de la navegación entre los cayos, lo cual es la base de la habilidad que hoy tienen los lancheros y guías.`,
              `El Nacimiento de Morrocoy y el Turismo.`,
              `El punto de inflexión llegó en 1974 con la creación del Parque Nacional Morrocoy. Esta declaración oficial de protección ambiental atrajo la atención nacional e internacional.`,
              `A partir de ese momento, Chichiriviche dejó de ser principalmente un pueblo de sal y pesca para convertirse en la principal puerta de entrada al paraíso. El turismo se convirtió en el motor económico, y el conocimiento ancestral de los pescadores se transformó en el servicio de guiatura y transporte hacia los cayos.`
              ], },
    en: {
      title: "Chichiriviche",
      description: "Located in Falcón state, Chichiriviche is a vibrant coastal town and the main gateway to Morrocoy National Park. This is a true coastal paradise offering some of Venezuela's most beautiful beaches. Its crystal clear waters, white sand, and idyllic cays make it a perfect destination for lovers of the sea, wildlife, and sunshine.", 
      culture: [`Beyond its famous keys, Chichiriviche is a coastal town with its own identity, forged by the sea and tourism. Its culture is a reflection of Caribbean life: vibrant, relaxed, and deeply focused on hospitality.`,
              `Although tourism is the current driving force, artisanal fishing remains a vital part of the town's identity. The local boatmen and guides have a deep knowledge of the sea and Morrocoy National Park, passed down through generations of fishermen. This connection to the sea ensures that the boat services are authentic and operated by those who best know the area.`
              ],
      attractions: [
        `The stars of Morrocoy are its cays, small coral islands with white sand, surrounded by a sea of ​​intense blue and turquoise hues. The most notable cays are:`,
        `Cayo Sombrero 
 This is the most famous and popular cay. It is characterized by its lush vegetation of palm trees that reach the shore, offering ideal natural shade.`,
        `Cayo Sal 
 A smaller, more rustic cay, known for the presence of a natural salt flat that gives it its name. It is less crowded than Cayo Sombrero.`,
        `Cayo Peraza 
 Famous for its sandbanks that emerge and create large, shallow natural pools. It's a perfect place for boats to anchor.`,
        `Cayo Muerto 
 Despite its name, this is a lively key. It usually has very calm, shallow waters near the shore.`
      ],
      history: [`A Fishing Village`,
`For centuries, the local economy was based on a combination of artisanal fishing and salt production. The inhabitants developed a deep understanding of the marine ecosystem and navigation between the keys, which is the basis for the skills that boatmen and guides have today.`,
              `The Birth of Morrocoy and Tourism.`,
              `The turning point came in 1974 with the creation of Morrocoy National Park. This official declaration of environmental protection attracted national and international attention.`,
              `From that moment on, Chichiriviche ceased to be primarily a salt and fishing village and became the main gateway to paradise. Tourism became the economic engine, and the ancestral knowledge of the fishermen was transformed into guiding and transportation services to the keys.`
              ], }
  },
  canaima: {
    es: {
      title: "Canaima",
      description: [`El Parque Nacional Canaima no es solo un destino; es una experiencia que te transporta a la prehistoria. Declarado Patrimonio de la Humanidad por la UNESCO, este vasto territorio de más de 30.000 kilómetros cuadrados en el estado Bolívar es uno de los lugares más antiguos y geológicamente únicos del planeta. Aquí, la selva tropical se encuentra con un paisaje que desafía toda lógica.`,
         `Canaima es la tierra de los tepuyes, gigantescas montañas de cima plana que se elevan como fortalezas inexpugnables, cortando el cielo con paredes verticales que han permanecido inalterables por miles de millones de años. Estos monumentos naturales no solo son la fuente de impresionantes cascadas, sino que también son considerados sitios sagrados por el pueblo indígena Pemón, los guardianes ancestrales de esta tierra.`
      ],
      culture: [`La visita a Canaima es, inherentemente, un viaje cultural. La experiencia es inseparable de la rica tradición del Pueblo Pemón, la etnia indígena que ha habitado y custodiado el Parque Nacional por milenios. Ellos son la voz de la tierra y los guías de la aventura.`,
        `Para el Pemón, los imponentes tepuyes (montañas de cima plana) no son solo formaciones geológicas; son sitios sagrados y el hogar de espíritus ancestrales. Su respeto y entendimiento de este ecosistema milenario son la base de su vida y de su cultura. Los Pemón mantienen un conocimiento profundo de las rutas fluviales y de la selva que es vital para cualquier expedición segura.`
      ],
      attractions: [
        `La experiencia en Canaima se divide entre la inmensidad de los tepuyes y la vida vibrante de su laguna, ofreciendo aventura y asombro en cada rincón.`,
        `1. El Salto Ángel 
        Es la estrella indiscutible del parque. El Salto Ángel no es solo la cascada más alta del mundo (casi 1.000 metros de caída libre), es un hito de la geografía mundial que inspira respeto.`,
        `2. La Laguna de Canaima y sus Cascadas
 Desde la Laguna, puedes visitar las imponentes caídas de agua de Salto Ucaima, Salto Golondrina y Salto Hacha. Lo más memorable es la experiencia de caminar por detrás de la cortina de agua en el Salto El Sapo.`,
        `3. Los Tepuyes: Auyantepui y Roraima
Es la formación más famosa, ya que de su cima se desprende el Salto Ángel. Ver esta inmensa mesa de piedra elevándose sobre la selva es un espectáculo visual constante.`,
        `4. La Cultura Pemón
Ningún viaje a Canaima está completo sin interactuar con el Pueblo Pemón, los habitantes ancestrales del parque. Ellos son los guías, los lancheros y los anfitriones.

Compartir con las comunidades cercanas a la Laguna te ofrece una inmersión en su rica cosmogonía, sus leyendas sobre los tepuyes y su profunda conexión con la tierra, enriqueciendo el viaje con autenticidad cultural.`,
        
      ],
      history: [ `La historia de Canaima se remonta al período Precámbrico. Los imponentes tepuyes (incluyendo el Auyantepui) no son solo montañas; son las formaciones geológicas más antiguas de la Tierra, con una edad que supera los 2 mil millones de años. Estas mesetas de cima plana son restos de un supercontinente primitivo y han resistido la erosión a lo largo de eones, creando un ecosistema que ha evolucionado en aislamiento total.`,
      `El descubrimiento oficial se atribuye al aventurero y aviador estadounidense Jimmy Angel. En 1933, mientras buscaba un río de oro, divisó la inmensa caída de agua. Años más tarde, en 1937, aterrizó su avioneta sobre la cima del Auyantepui, confirmando la existencia de esta maravilla natural y dando paso a la era de la exploración turística moderna.`,
      `Así, la historia de Canaima es una mezcla de ciencia milenaria, leyenda indígena y audacia de la aviación, haciendo de cada visita un encuentro con el pasado profundo de la Tierra.`
    ],

    },
    en: {
      title: "Canaima",
      description:[`Canaima National Park is not just a destination; it is an experience that transports you back to prehistoric times. Declared a World Heritage Site by UNESCO, this vast territory of more than 30,000 square kilometers in Bolívar state is one of the oldest and most geologically unique places on the planet. Here, the rainforest meets a landscape that defies all logic.`,
         `Canaima is the land of the tepuis, gigantic flat-topped mountains that rise like impregnable fortresses, cutting through the sky with vertical walls that have remained unchanged for billions of years. These natural monuments are not only the source of impressive waterfalls, but are also considered sacred sites by the Pemón indigenous people, the ancestral guardians of this land.`
      ],
      culture: [`A visit to Canaima is inherently a cultural journey. The experience is inseparable from the rich tradition of the Pemón people, the indigenous ethnic group that has inhabited and guarded the National Park for millennia. They are the voice of the land and the guides of the adventure.`,
        `For the Pemón, the imposing tepuis (flat-topped mountains) are not just geological formations; they are sacred sites and home to ancestral spirits. Their respect and understanding of this ancient ecosystem are the foundation of their life and culture. The Pemón maintain a deep knowledge of the river routes and the jungle that is vital for any safe expedition.`
      ],
      attractions: [
        `The Canaima experience is divided between the immensity of the tepuis and the vibrant life of its lagoon, offering adventure and wonder around every corner.`,
        `1. El Salto Ángel
        This is the undisputed star attraction of the park. Salto Ángel is not only the highest waterfall in the world (almost 1,000 meters of free fall), it is a landmark of world geography that inspires awe.`,
        `2. Canaima Lake and its Waterfalls
 From the lake, you can visit the impressive waterfalls of Salto Ucaima, Salto Golondrina, and Salto Hacha. The most memorable experience is walking behind the curtain of water at Salto El Sapo.`,
        `3. The Tepuis: Auyantepui and Roraima
This is the most famous formation, as Salto Ángel cascades from its summit. Seeing this immense stone table rising above the jungle is a constant visual spectacle.`,
        `4. Pemón Culture
No trip to Canaima is complete without interacting with the Pemón people, the ancestral inhabitants of the park. They are the guides, boatmen, and hosts.

Sharing with the communities near the lagoon offers you an immersion in their rich cosmogony, their legends about the tepuis, and their deep connection to the land, enriching the trip with cultural authenticity.`,
        
      ],
      history: [ `The history of Canaima dates back to the Precambrian period. The imposing tepuis (including Auyantepui) are not just mountains; they are the oldest geological formations on Earth, dating back more than 2 billion years. These flat-topped plateaus are remnants of a primitive supercontinent and have resisted erosion over eons, creating an ecosystem that has evolved in total isolation.`,
      `The official discovery is attributed to American adventurer and aviator Jimmy Angel. In 1933, while searching for a river of gold, he spotted the immense waterfall. Years later, in 1937, he landed his plane on the top of Auyantepui, confirming the existence of this natural wonder and ushering in the era of modern tourist exploration.`,
      `Thus, the history of Canaima is a mixture of ancient science, indigenous legend, and aviation audacity, making each visit an encounter with the Earth's deep past.`
    ],
    }
  },
  merida: {
    es: {
      title: "Mérida",
      description: [ `Mérida es un estado que se alza majestuosamente en la Cordillera de Los Andes. La belleza de Mérida va más allá de sus montañas; reside profundamente en la calidez de su gente y en una cultura rica en tradición. La ciudad te recibe con una hospitalidad genuina y un ritmo de vida más pausado. Aquí, la historia se siente en cada esquina colonial y en cada sabor de su gastronomía sustanciosa, desde la tradicional pisca andina hasta las frescas truchas de sus ríos.`,
        `Mérida te ofrece la oportunidad perfecta para cambiar la rutina y recargar energías en un ambiente de ensueño. Es el destino ideal si buscas la paz de la montaña, la adrenalina de la altura y un contacto auténtico con la cultura venezolana. Con SARQUI, puedes dejar atrás el calor y la prisa de la ciudad para encontrarte con el frío de la montaña, las leyendas de los páramos y el encanto de una ciudad que, sin duda, te robará el corazón.`
      ],
      culture: [
        `La cultura merideña es un tesoro de tradiciones bien conservadas. Sus habitantes son conocidos por su hospitalidad genuina y su orgullo por la tierra. Esta mezcla de tradición y vitalidad se debe en parte a que Mérida es un importante centro universitario, lo que inyecta una energía juvenil y artística en un entorno colonial. Al recorrer sus calles, te encuentras con artesanía local, iglesias históricas y un profundo sentido de comunidad.`,
        `El clima frío de la sierra ha forjado una cocina que es sustanciosa, reconfortante y deliciosa. La gastronomía andina es un atractivo cultural clave que debes explorar:`,
        `La Pisca Andina
        La sopa tradicional por excelencia. Perfecta para empezar el día, esta sopa a base de papa, huevo, leche y cilantro es el desayuno o el tónico perfecto para combatir el frío de la mañana.`,
        `Las Truchas
        El estado es famoso por la calidad de sus truchas frescas, servidas de diversas maneras en los restaurantes del páramo.`,
        `Dulces y Postres
        No puedes irte sin probar los famosos dulces abrillantados y los bizcochos que acompañan el café andino.`,
        `Mérida te ofrece la oportunidad de conectar con la Venezuela auténtica, donde cada plato cuenta una historia de tradición y cada sonrisa de sus habitantes te hace sentir en casa.`
      ],

      attractions:[
        `Mérida es un llamado directo a la aventura en la alta montaña. El estado ofrece paisajes que van más allá de lo espectacular, desde picos nevados hasta la vida vibrante de la ciudad. Prepárate para descubrir los puntos clave que componen esta vivencia andina:`,
        `1. Teleférico Mukumbarí
Es la joya de la corona y el principal atractivo. El Teleférico de Mérida es el más alto y más largo del mundo, una hazaña que conecta la ciudad con el Parque Nacional Sierra Nevada.
Su punto más es de 4.000 metros sobre el nivel del mar, ofrece una vista inigualable del Pico Bolívar (la cima más alta de Venezuela) y te da la oportunidad de sentir el clima de alta montaña en su máxima expresión.`,
        `2. Los Páramos y sus Frailejones
El páramo es un ecosistema único en el mundo, característico de los Andes venezolanos. Este valle de origen glaciar, rodeado por montañas y frailejones, es un punto de inicio popular para caminatas y paseos. Su belleza escénica es incomparable.`,
        `3. La Ciudad de Mérida y su Centro Histórico
La ciudad en sí misma es un destino lleno de encanto colonial y vida vibrante. La Plaza Bolívar: El centro neurálgico, rodeado por la Catedral Basílica Menor, el Palacio Arzobispal y el Palacio de Gobierno.`,
      ],
      history: [
        `Mérida fue fundada en 1558 por el capitán Juan Rodríguez Suárez. Su ubicación en un valle alto de los Andes la convirtió en un punto estratégico para la conexión y el comercio en la Capitanía General de Venezuela. Aunque la ciudad sufrió los efectos del devastador terremoto de 1812, fue reconstruida con determinación, manteniendo su hermoso trazado colonial y su fuerte carácter religioso, reflejado en sus numerosas iglesias y conventos.`,
        `Un hito crucial en la identidad de Mérida fue la fundación de la Universidad de Los Andes (ULA). Esta institución transformó la ciudad, convirtiéndola en un centro de conocimiento, cultura y ciencia que aún hoy atrae a estudiantes y profesionales de todo el país. El apodo de "Ciudad de los Caballeros" se complementó con el de "Ciudad Universitaria".`,
        `En el siglo XX, Mérida reafirmó su importancia como destino turístico y científico. La construcción del Teleférico de Mérida (hoy Mukumbarí), el más alto y largo del mundo, no solo impulsó el turismo internacional, sino que también demostró la capacidad de la región para conectar la modernidad con la inmensidad de sus montañas.`,
        `Hoy, Mérida equilibra con gracia su pasado colonial con la energía universitaria, ofreciendo una rica mezcla de tradición y vitalidad en el corazón de los Andes.`,
      ]
    },
    en: {
      title: "Mérida",
      description: [ `Mérida is a state that rises majestically in the Andes Mountains. Mérida's beauty goes beyond its mountains; it lies deeply in the warmth of its people and in a culture rich in tradition. The city welcomes you with genuine hospitality and a slower pace of life. Here, history can be felt in every colonial corner and in every flavor of its hearty cuisine, from the traditional Andean pisca to the fresh trout from its rivers.`,
        `Mérida offers you the perfect opportunity to break your routine and recharge your batteries in a dreamlike setting. It is the ideal destination if you are looking for the peace of the mountains, the adrenaline rush of the heights, and authentic contact with Venezuelan culture. With SARQUI, you can leave behind the heat and hustle and bustle of the city to find the cool of the mountains, the legends of the moors, and the charm of a city that will undoubtedly steal your heart.`
      ],
      culture: [
        `Merida's culture is a treasure trove of well-preserved traditions. Its inhabitants are known for their genuine hospitality and pride in their land. This blend of tradition and vitality is partly due to the fact that Merida is an important university center, which injects youthful and artistic energy into a colonial setting. As you stroll through its streets, you will encounter local crafts, historic churches, and a deep sense of community.`,
        `The cold climate of the mountains has forged a cuisine that is hearty, comforting, and delicious. Andean cuisine is a key cultural attraction that you must explore:`,
        `La Pisca Andina
         The traditional soup par excellence. Perfect for starting the day, this soup made with potatoes, eggs, milk, and cilantro is the perfect breakfast or tonic to combat the morning cold.`,
        `Trout
         The state is famous for the quality of its fresh trout, served in a variety of ways in the restaurants of the páramo.`,
        `Sweets and Desserts
         You can't leave without trying the famous abrillantados sweets and biscuits that accompany Andean coffee.`,
        `Mérida offers you the opportunity to connect with authentic Venezuela, where every dish tells a story of tradition and every smile from its inhabitants makes you feel at home.`
      ],
      attractions: [
          `Mérida is a direct call to adventure in the high mountains. The state offers landscapes that go beyond spectacular, from snow-capped peaks to the vibrant city life. Get ready to discover the key points that make up this Andean experience:`,
        `1. Mukumbarí Cable Car
This is the crown jewel and main attraction. The Mérida Cable Car is the highest and longest in the world, a feat that connects the city with the Sierra Nevada National Park.
Its highest point is 4,000 meters above sea level, offering an unparalleled view of Pico Bolívar (the highest peak in Venezuela) and giving you the opportunity to experience the high mountain climate at its best.`,
        `2. 2. The Páramos and their Frailejones
The páramo is a unique ecosystem in the world, characteristic of the Venezuelan Andes. This glacial valley, surrounded by mountains and frailejones, is a popular starting point for hikes and walks. Its scenic beauty is unmatched.`,
        `3. The City of Mérida and its Historic Center
The city itself is a destination full of colonial charm and vibrant life. Plaza Bolívar: The nerve center, surrounded by the Minor Basilica Cathedral, the Archbishop's Palace, and the Government Palace.`,
      ],
      history: [
        `Mérida was founded in 1558 by Captain Juan Rodríguez Suárez. Its location in a high valley of the Andes made it a strategic point for connection and trade in the Captaincy General of Venezuela. Although the city suffered the effects of the devastating earthquake of 1812, it was rebuilt with determination, maintaining its beautiful colonial layout and strong religious character, reflected in its numerous churches and convents.`,
        `A crucial milestone in Mérida's identity was the founding of the University of Los Andes (ULA). This institution transformed the city, turning it into a center of knowledge, culture, and science that still attracts students and professionals from all over the country. The nickname “City of Knights” was complemented by that of “University City.”`,
        `In the 20th century, Mérida reaffirmed its importance as a tourist and scientific destination. The construction of the Mérida Cable Car (now Mukumbarí), the highest and longest in the world, not only boosted international tourism but also demonstrated the region's ability to connect modernity with the immensity of its mountains.`,
        `Today, Mérida gracefully balances its colonial past with university energy, offering a rich blend of tradition and vitality in the heart of the Andes.`,
      ]
    }
  }
};

export default function Explore() {
  const { t, language } = useLanguage();
  const [selectedDestination, setSelectedDestination] = useState<"chichiriviche" | "canaima" | "merida">("chichiriviche");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const currentInfo = destinationsInfo[selectedDestination][language as "es" | "en"];

  // Función para obtener imágenes según el destino seleccionado
  const getDestinationImages = (destination: string) => {
    const imageMap = {
      chichiriviche: {
        main: '/assets/camino.jpg',
        attractions: '/assets/cayo-sombrero.jpg',
        culture: '/assets/pescadores.jpg',
        history: '/assets/cayo-peraza.jpg'
      },
      canaima: {
        main: '/assets/tepuyes.jpg',
        attractions: '/assets/saltoangel.jpg',
        culture: '/assets/los-pemones.jpg',
        history: '/assets/laguna-canaima.jpg'
      },
      merida: {
        main: '/assets/merida-andes.jpg',
        attractions: '/assets/teleferico.jpg',
        culture: '/assets/gastronomia.jpg',
        history: '/assets/pueblo.jpg'
      }
    };
    
    return imageMap[destination as keyof typeof imageMap] || imageMap.chichiriviche;
  };

  const images = getDestinationImages(selectedDestination);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <span className="text-sm text-secondary font-medium uppercase tracking-wider">
                {t.explore.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
                {t.explore.title}
              </h1>
            </div>
          </div>
        </section>
        
        {/* Destination Selection */}
        <section className="section">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                variant={selectedDestination === "chichiriviche" ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedDestination("chichiriviche")}
                className="min-w-[160px]"
              >
                Chichiriviche
              </Button>
              <Button
                variant={selectedDestination === "canaima" ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedDestination("canaima")}
                className="min-w-[160px]"
              >
                Canaima
              </Button>
              <Button
                variant={selectedDestination === "merida" ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedDestination("merida")}
                className="min-w-[160px]"
              >
                Mérida
              </Button>
            </div>
            
            {/* Destination Info */}
            <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
              {/* Descripción con imagen al lado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-5xl font-bold mb-6">{currentInfo.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {Array.isArray(currentInfo.description) ? currentInfo.description.join('\n\n') : currentInfo.description}
                  </p>
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={images.main}
                    alt={currentInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Atracciones con imagen al lado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={images.attractions}
                    alt="Atracciones"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-4xl font-bold mb-6">
                    {language === "es" ? "Atracciones Principales" : "Main Attractions"}
                  </h3>
                  <div className="space-y-3">
                    {currentInfo.attractions.map((attraction, index) => (
                      index === 0 ? (
                        <p key={index} className="text-muted-foreground mb-6" style={{ whiteSpace: 'pre-line' }}>
                          {attraction}
                        </p>
                      ) : (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>
                            {attraction.includes('Cayo Sombrero') || 
                             attraction.includes('Cayo Sal') || 
                             attraction.includes('Cayo Peraza') || 
                             attraction.includes('Cayo Muerto') ||
                             attraction.includes('1. El Salto Ángel') ||
                             attraction.includes('2. La Laguna de Canaima') ||
                             attraction.includes('3. Los Tepuyes:') ||
                             attraction.includes('4. La Cultura Pemón') ||
                             attraction.includes('1. Teleférico Mukumbarí') ||
                             attraction.includes('2. Los Páramos y sus Frailejones') ||
                             attraction.includes('3. La Ciudad de Mérida')
                              ? (
                                <>
                                  <span className="font-bold text-primary">
                                    {attraction.split('\n')[0]}
                                  </span>
                                  {'\n'}{attraction.split('\n').slice(1).join('\n')}
                                </>
                              ) 
                              : attraction
                            }
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Cultura con imagen al lado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold mb-6">
                    {language === "es" ? "Cultura" : "Culture"}
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(currentInfo.culture) ? 
                      currentInfo.culture.map((text, index) => (
                        text.includes("La Pisca Andina") || 
                        text.includes("Las Truchas") || 
                        text.includes("Dulces y Postres") ? (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>
                              {text.split('\n').map((line, i) => 
                                i === 0 ? (
                                  <span key={i} className="font-bold text-primary">{line}<br/></span>
                                ) : (
                                  <span key={i}>{line}</span>
                                )
                              )}
                            </span>
                          </div>
                        ) : (
                          <p key={index} className="text-muted-foreground leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                            {text}
                          </p>
                        )
                      )) : 
                      <p className="text-muted-foreground leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                        {currentInfo.culture}
                      </p>
                    }
                  </div>
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={images.culture}
                    alt="Cultura"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Historia con imagen al lado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={images.history}
                    alt="Historia"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-4xl font-bold mb-6">
                    {language === "es" ? "Historia" : "History"}
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(currentInfo.history) ? 
                      currentInfo.history.map((text, index) => {
                        // Elementos específicos con viñetas
                        if (text === "Un Pueblo de Pescadores" || text === "El Nacimiento de Morrocoy y el Turismo.") {
                          return (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-primary font-semibold" style={{ whiteSpace: 'pre-line' }}>{text}</span>
                            </div>
                          );
                        }
                        // Resto de elementos sin viñetas
                        else {
                          return (
                            <p key={index} className="text-muted-foreground leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                              {text}
                            </p>
                          );
                        }
                      }) : 
                      <p className="text-muted-foreground leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                        {currentInfo.history}
                      </p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
