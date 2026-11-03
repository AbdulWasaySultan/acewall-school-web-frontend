import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ContactInfo = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="mb-4">
        <Label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Email Address*
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="name@company.com"
          required
          aria-required="true"
          value={formData.email || ""}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <Label
          htmlFor="phone"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Phone Number
        </Label>
        <Input
          type="tel"
          name="phone"
          id="phone"
          placeholder="(123) 456-7890"
          required
          aria-required="true"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          value={formData.phone || ""}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </>
  );
};

export default ContactInfo;
