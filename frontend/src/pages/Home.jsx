import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import DealOfTheDay from '../components/DealOfTheDay'
import CategoriesToBag from '../components/CategoriesToBag'
import ColoursOfTheSeason from '../components/ColoursOfTheSeason'

const Home = () => {
  return (
    <div>
    <div className = 'px-[20px]'>
      <Carousel/>
      <DealOfTheDay/>
      <CategoriesToBag/>
      <ColoursOfTheSeason/>
    </div>
     <Footer/>
    </div>
  )
}

export default Home
