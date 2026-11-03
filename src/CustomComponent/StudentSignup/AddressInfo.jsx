import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const AddressInfo = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    homeAddressLine1 = "",
    homeAddressLine2 = "",
    homeCity = "",
    homeState = "",
    homeZip = "",
    mailingAddressLine1 = "",
    mailingAddressLine2 = "",
    mailingCity = "",
    mailingState = "",
    mailingZip = "",
  } = watch();

  // Concatenate Home Address
  useEffect(() => {
    const fullHomeAddress = `${homeAddressLine1}, ${
      homeAddressLine2 ? homeAddressLine2 + ", " : ""
    }${homeCity}, ${homeState} ${homeZip}`;
    setValue("homeAddress", fullHomeAddress);
  }, [homeAddressLine1, homeAddressLine2, homeCity, homeState, homeZip]);

  // Concatenate Mailing Address
  useEffect(() => {
    const fullMailingAddress = `${mailingAddressLine1}, ${
      mailingAddressLine2 ? mailingAddressLine2 + " " : ""
    }${mailingCity}, ${mailingState} ${mailingZip}`;
    setValue("mailingAddress", fullMailingAddress);
  }, [
    mailingAddressLine1,
    mailingAddressLine2,
    mailingCity,
    mailingState,
    mailingZip,
  ]);

  return (
    <>
      {/* Home Address Section */}
      <fieldset className="mb-6">
        <legend className="font-medium text-gray-700 mb-2">Home Address</legend>

        <div className="mb-2">
          <Label htmlFor="homeAddressLine1">Address Line 1 *</Label>
          <Input
            id="homeAddressLine1"
            {...register("homeAddressLine1", {
              required: "Address Line 1 is required",
            })}
            placeholder="Address Line 1"
            aria-required="true"
            aria-invalid={errors?.homeAddressLine1 ? "true" : "false"}
            aria-describedby="homeAddressLine1-error"
            className="mt-2"
          />
          {errors?.homeAddressLine1 && (
            <p
              id="homeAddressLine1-error"
              className="text-xs text-red-600 mt-1"
            >
              {errors.homeAddressLine1.message}
            </p>
          )}
        </div>

        <div className="mb-2">
          <Label htmlFor="homeAddressLine2">Address Line 2 (Optional)</Label>
          <Input
            id="homeAddressLine2"
            {...register("homeAddressLine2")}
            placeholder="Address Line 2"
            className="mt-2"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <div className="flex-1">
            <Label htmlFor="homeCity">City / Town *</Label>
            <Input
              id="homeCity"
              {...register("homeCity", { required: "City is required" })}
              placeholder="City / Town"
              aria-required="true"
              aria-invalid={errors?.homeCity ? "true" : "false"}
              aria-describedby="homeCity-error"
            />
            {errors?.homeCity && (
              <p id="homeCity-error" className="text-xs text-red-600 mt-1">
                {errors.homeCity.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Label htmlFor="homeState">State / Province *</Label>
            <Input
              id="homeState"
              {...register("homeState", { required: "State is required" })}
              placeholder="State / Province"
              aria-required="true"
              aria-invalid={errors?.homeState ? "true" : "false"}
              aria-describedby="homeState-error"
            />
            {errors?.homeState && (
              <p id="homeState-error" className="text-xs text-red-600 mt-1">
                {errors.homeState.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Label htmlFor="homeZip">ZIP / Postal *</Label>
            <Input
              id="homeZip"
              {...register("homeZip", { required: "ZIP Code is required" })}
              placeholder="ZIP / Postal"
              aria-required="true"
              aria-invalid={errors?.homeZip ? "true" : "false"}
              aria-describedby="homeZip-error"
            />
            {errors?.homeZip && (
              <p id="homeZip-error" className="text-xs text-red-600 mt-1">
                {errors.homeZip.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Mailing Address Section */}
      <fieldset className="mb-6">
        <legend className="font-medium text-gray-700 mb-2">
          Mailing Address (if different)
        </legend>

        <div className="mb-2">
          <Label htmlFor="mailingAddressLine1">Address Line 1 *</Label>
          <Input
            id="mailingAddressLine1"
            {...register("mailingAddressLine1", {
              required: "Address Line 1 is required",
            })}
            placeholder="Address Line 1"
            aria-required="true"
            aria-invalid={errors?.mailingAddressLine1 ? "true" : "false"}
            aria-describedby="mailingAddressLine1-error"
            className="mt-2"
          />
          {errors?.mailingAddressLine1 && (
            <p
              id="mailingAddressLine1-error"
              className="text-xs text-red-600 mt-1"
            >
              {errors.mailingAddressLine1.message}
            </p>
          )}
        </div>

        <div className="mb-2">
          <Label htmlFor="mailingAddressLine2">Address Line 2 (Optional)</Label>
          <Input
            id="mailingAddressLine2"
            {...register("mailingAddressLine2")}
            placeholder="Address Line 2"
            className="mt-2"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <div className="flex-1">
            <Label htmlFor="mailingCity">City / Town *</Label>
            <Input
              id="mailingCity"
              {...register("mailingCity", { required: "City is required" })}
              placeholder="City / Town"
              aria-required="true"
              aria-invalid={errors?.mailingCity ? "true" : "false"}
              aria-describedby="mailingCity-error"
            />
            {errors?.mailingCity && (
              <p id="mailingCity-error" className="text-xs text-red-600 mt-1">
                {errors.mailingCity.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Label htmlFor="mailingState">State / Province *</Label>
            <Input
              id="mailingState"
              {...register("mailingState", { required: "State is required" })}
              placeholder="State / Province"
              aria-required="true"
              aria-invalid={errors?.mailingState ? "true" : "false"}
              aria-describedby="mailingState-error"
            />
            {errors?.mailingState && (
              <p id="mailingState-error" className="text-xs text-red-600 mt-1">
                {errors.mailingState.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Label htmlFor="mailingZip">ZIP / Postal *</Label>
            <Input
              id="mailingZip"
              {...register("mailingZip", { required: "ZIP Code is required" })}
              placeholder="ZIP / Postal"
              aria-required="true"
              aria-invalid={errors?.mailingZip ? "true" : "false"}
              aria-describedby="mailingZip-error"
            />
            {errors?.mailingZip && (
              <p id="mailingZip-error" className="text-xs text-red-600 mt-1">
                {errors.mailingZip.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default AddressInfo;
