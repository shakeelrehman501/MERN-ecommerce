import { socialLinks } from "@/lib/constants";

function Footer() {
  
  return (
    <div className="relative bg-gray-800  text-white py-12 px-2 sm:px-8 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div>
              <img src="/logo.png" alt="logo_img" className="w-50 bg-white p-2 mb-5" />
              <p className="text-gray-400   mb-4">
                Discover premium products at unbeatable prices. We deliver quality, value, and a seamless shopping experience. Shop with confidence, anytime and anywhere
              </p>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <div  key={index}>
                    <a
                      href={social.href}
                      className="bg-gray-700 hover:bg-blue-500 p-2 rounded-lg flex"
                      aria-label={social.name}
                    >
                      <Icon />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div type="slideRight" className="text-xl font-bold  mb-4">
              Customer Service
            </div>
            <div className="flex flex-col gap-2 text-gray-400">
              <span>Contact Us</span>
              <span>Shipping & Returns</span>
              <span>FAQs</span>
              <span>Order Tracking</span>
              <span>Size Guide</span>
            </div>
            
          </div>

          {/* Contact Info */}
          <div>
            <div >
              <h4 className="text-lg font-bold   mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400  ">
                <li>Email: shakeelrehman501@gmail.com</li>
                <li className="">
                  Phone: {""}
                  <a
                    href="tel:+923000787595"
                    className=" hover:text-purple-400 group"
                  >
                    0300-0787595
                  </a>
                </li>
                <li>Address: Barkat Market, Lahore</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div>
            <p className="text-gray-400   text-sm">
              © {new Date().getFullYear()} Dav Developers. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;