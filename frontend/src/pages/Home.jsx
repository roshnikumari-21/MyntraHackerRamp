import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import DealOfTheDay from '../components/DealOfTheDay'
import CategoriesToBag from '../components/CategoriesToBag'
import ColoursOfTheSeason from '../components/ColoursOfTheSeason'
import NewFeatureNotice from '../components/NewFeatureNotice'
import SwyftBanner from '../components/SwyftBanner'

const Home = () => {
  return (
    <div>
      <NewFeatureNotice/>
    <div className = 'px-[20px]'>
      <SwyftBanner/>
      <Carousel/>
      <ColoursOfTheSeason/>
      <DealOfTheDay/>
      <CategoriesToBag/>
    </div>
     <Footer/>
    </div>
  )
}

export default Home
