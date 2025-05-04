export default function NewsletterSignup() {
  return (
    <div className="bg-gray-900 text-white rounded-lg p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Ready to Get Our New Stuff?</h2>
        <p className="text-gray-300 mb-6">Stuffsus for Homes and Needs</p>
        <p className="text-gray-300 mb-6">
          We'll listen to your needs, identify the best products, and then create a beautiful smart TV shopping solution
          that's right for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input type="email" placeholder="Your Email" className="px-4 py-3 rounded-md bg-white text-black flex-1" />
          <button className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-100">Send</button>
        </div>
      </div>
    </div>
  )
}
