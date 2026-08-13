// app/admin/products/add/page.tsx

import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ColorPickerField from "../components/ColorPickerField";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ProductGender =
  | "men"
  | "women"
  | "unisex"
  | "kids";

/* ==========================================================================
   ADD PRODUCT SERVER ACTION
   ========================================================================== */

async function addProductAction(
  formData: FormData,
) {
  "use server";

  /* ------------------------------------------------------------------------
     PRODUCT NAME
     ------------------------------------------------------------------------ */

  const name =
    formData.get("name") as string;

  if (!name?.trim()) {
    throw new Error(
      "Product name is required.",
    );
  }

  /* ------------------------------------------------------------------------
     SLUG
     ------------------------------------------------------------------------ */

  const customSlug =
    formData.get("slug");

  const slug =
    typeof customSlug === "string" &&
    customSlug.trim()
      ? customSlug
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/gi, "")
          .replace(/\s+/g, "-")
          .substring(0, 200)
      : name
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/gi, "")
          .replace(/\s+/g, "-")
          .substring(0, 200);

  /* ------------------------------------------------------------------------
     GENDER / AUDIENCE
     ------------------------------------------------------------------------ */

  const genderRaw =
    formData.get("gender");

  const allowedGenders: ProductGender[] =
    [
      "men",
      "women",
      "unisex",
      "kids",
    ];

  if (
    typeof genderRaw !== "string" ||
    !allowedGenders.includes(
      genderRaw as ProductGender,
    )
  ) {
    throw new Error(
      "Please select a valid product audience.",
    );
  }

  const gender =
    genderRaw as ProductGender;

  /* ------------------------------------------------------------------------
     HERO IMAGE
     ------------------------------------------------------------------------ */

  const heroImageFile =
    formData.get(
      "heroImage",
    ) as File;

  let heroImageAsset;

  if (
    heroImageFile &&
    heroImageFile.size > 0
  ) {
    heroImageAsset =
      await serverClient.assets.upload(
        "image",
        heroImageFile,
      );
  }

  /* ------------------------------------------------------------------------
     THUMBNAILS
     ------------------------------------------------------------------------ */

  const thumbnails: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  }[] = [];

  for (
    let index = 1;
    index <= 4;
    index++
  ) {
    const thumbFile =
      formData.get(
        `thumb${index}`,
      ) as File;

    if (
      thumbFile &&
      thumbFile.size > 0
    ) {
      const asset =
        await serverClient.assets.upload(
          "image",
          thumbFile,
        );

      thumbnails.push({
        _type: "image",

        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      });
    }
  }

  /* ------------------------------------------------------------------------
     DESCRIPTION
     ------------------------------------------------------------------------ */

  const descriptionRaw =
    formData.get(
      "description",
    );

  const descriptionArray =
    typeof descriptionRaw === "string"
      ? descriptionRaw
          .split("\n")
          .map((line) =>
            line.trim(),
          )
          .filter(Boolean)
      : [];

  /* ------------------------------------------------------------------------
     COLORS
     ------------------------------------------------------------------------ */

  const colorLabels =
    formData.getAll(
      "colorLabel",
    ) as string[];

  const colorHexes =
    formData.getAll(
      "colorHex",
    ) as string[];

  const colors =
    colorLabels
      .map(
        (
          label,
          index,
        ) => ({
          label:
            label.trim(),

          hex:
            colorHexes[index] ||
            "#000000",
        }),
      )
      .filter(
        (color) =>
          color.label !== "",
      );

  /* ------------------------------------------------------------------------
     SIZES
     ------------------------------------------------------------------------ */

  const sizesRaw =
    formData.get("sizes");

  const sizesArray =
    typeof sizesRaw === "string"
      ? sizesRaw
          .split(",")
          .map((size) =>
            size.trim(),
          )
          .filter(Boolean)
      : [];

  /* ------------------------------------------------------------------------
     CATEGORIES
     ------------------------------------------------------------------------ */

  const categories =
    formData
      .getAll("categories")
      .filter(
        (
          category,
        ): category is string =>
          typeof category ===
            "string" &&
          category.trim() !== "",
      );

  if (
    categories.length === 0
  ) {
    throw new Error(
      "Please select at least one category.",
    );
  }

  /* ------------------------------------------------------------------------
     PRODUCT DETAILS
     ------------------------------------------------------------------------ */

  const material =
    formData.get("material");

  const care =
    formData.get("care");

  const origin =
    formData.get("origin");

  /* ------------------------------------------------------------------------
     CREATE PRODUCT IN SANITY
     ------------------------------------------------------------------------ */

  await serverClient.create({
    _type: "product",

    name,

    slug: {
      _type: "slug",
      current: slug,
    },

    price:
      formData.get("price"),

    /**
     * Gender / audience field.
     *
     * Used by:
     * /men
     * /women
     * kids filtering
     * unisex filtering
     */
    gender,

    categories,

    description:
      descriptionArray,

    details: {
      material:
        typeof material ===
        "string"
          ? material
          : "",

      care:
        typeof care ===
        "string"
          ? care
          : "",

      origin:
        typeof origin ===
        "string"
          ? origin
          : "",
    },

    colors,

    sizes:
      sizesArray,

    stock:
      Number(
        formData.get("stock"),
      ) || 0,

    isNew:
      formData.get("isNew") ===
      "on",

    disabled:
      formData.get(
        "disabled",
      ) === "on",

    images: {
      hero:
        heroImageAsset
          ? {
              _type:
                "image",

              asset: {
                _type:
                  "reference",

                _ref:
                  heroImageAsset._id,
              },
            }
          : undefined,

      thumbnails:
        thumbnails.length >
        0
          ? thumbnails
          : [],
    },
  });

  /* ------------------------------------------------------------------------
     REFRESH PRODUCT ADMIN
     ------------------------------------------------------------------------ */

  revalidatePath(
    "/admin/products",
  );

  revalidatePath(
    "/men",
  );

  revalidatePath(
    "/women",
  );

  revalidatePath(
    "/new-arrivals",
  );

  redirect(
    "/admin/products?status=created",
  );
}

/* ==========================================================================
   ADD PRODUCT PAGE
   ========================================================================== */

export default function AddProductPage() {
  const inputClasses =
    "w-full p-4 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors";

  const labelClasses =
    "text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2";

  const categories = [
    "Accessories",
    "Streetwear",
    "Sets",
    "Shirts",
    "Tops",
    "Skirts",
    "Dresses",
    "Jackets",
    "Trousers",
    "Knitwear",
    "Pants",
  ];

  const genderOptions: {
    label: string;
    value: ProductGender;
    description: string;
  }[] = [
    {
      label: "Men",
      value: "men",
      description:
        "Displayed in the men's collection.",
    },

    {
      label: "Women",
      value: "women",
      description:
        "Displayed in the women's collection.",
    },

    {
      label: "Unisex",
      value: "unisex",
      description:
        "Displayed in both men's and women's collections.",
    },

    {
      label: "Kids",
      value: "kids",
      description:
        "Displayed in the kids collection.",
    },
  ];

  return (
    <div
      className="
        max-w-5xl
        mx-auto
        px-4
        md:px-0
        animate-fadeIn
      "
    >
      {/* ================================================================
          BACK BUTTON
      ================================================================= */}

      <div
        className="
          mb-8
          flex
          items-center
          gap-4
        "
      >
        <Link
          href="/admin/products"
          className="
            group
            flex
            items-center
            gap-2

            text-neutral-400
            hover:text-black

            transition-colors
          "
        >
          <ArrowLeft
            size={16}
          />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-widest
            "
          >
            Back to Products
          </span>
        </Link>
      </div>

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div
        className="
          mb-12
          border-b
          border-neutral-100
          pb-10
        "
      >
        <h1
          className="
            text-4xl
            md:text-5xl
            font-light
            tracking-tighter
            uppercase
            leading-[0.9]
          "
        >
          New{" "}

          <span className="font-black">
            Product
          </span>
        </h1>

        <p
          className="
            text-[10px]
            md:text-[11px]
            text-neutral-400
            uppercase
            tracking-widest
            font-medium
            mt-2
          "
        >
          Add a new product to the
          registry
        </p>
      </div>

      {/* ================================================================
          PRODUCT FORM
      ================================================================= */}

      <form
        action={
          addProductAction
        }
        className="
          bg-white

          p-8
          md:p-12

          border
          border-neutral-100

          space-y-10
        "
      >
        {/* ==============================================================
            PRODUCT NAME + SLUG
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
          "
        >
          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Product Name *
            </label>

            <input
              name="name"
              required
              className={
                inputClasses
              }
              placeholder="e.g., Classic African T-Shirt"
            />
          </div>

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Slug (URL)
            </label>

            <input
              name="slug"
              className={
                inputClasses
              }
              placeholder="auto-generated from name if left empty"
            />

            <p
              className="
                text-[8px]
                text-neutral-400
                mt-1
              "
            >
              Leave empty to
              auto-generate from name
            </p>
          </div>
        </div>

        {/* ==============================================================
            GENDER / AUDIENCE
        =============================================================== */}

        <div className="space-y-4">
          <div>
            <label
              className={
                labelClasses
              }
            >
              Gender / Audience *
            </label>

            <p
              className="
                text-[10px]
                text-neutral-400
                mt-1
              "
            >
              Controls which customer
              collection this product
              appears under.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4

              gap-3
            "
          >
            {genderOptions.map(
              (option) => (
                <label
                  key={
                    option.value
                  }
                  className="
                    group
                    relative

                    border
                    border-neutral-200

                    p-4

                    cursor-pointer

                    has-[:checked]:border-black
                    has-[:checked]:bg-neutral-50

                    hover:border-neutral-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={
                        option.value
                      }
                      required
                      className="
                        mt-0.5
                        w-4
                        h-4
                        accent-black
                      "
                    />

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.2em]
                          text-black
                        "
                      >
                        {
                          option.label
                        }
                      </p>

                      <p
                        className="
                          mt-2
                          text-[9px]
                          leading-relaxed
                          text-neutral-400
                        "
                      >
                        {
                          option.description
                        }
                      </p>
                    </div>
                  </div>
                </label>
              ),
            )}
          </div>
        </div>

        {/* ==============================================================
            CATEGORIES + PRICE
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
          "
        >
          {/* CATEGORIES */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Categories * (select
              one or more)
            </label>

            <div
              className="
                grid
                grid-cols-2
                gap-2

                border
                border-neutral-200

                p-4
              "
            >
              {categories.map(
                (category) => (
                  <label
                    key={
                      category
                    }
                    className="
                      flex
                      items-center
                      gap-2

                      text-xs
                      font-bold

                      cursor-pointer
                    "
                  >
                    <input
                      type="checkbox"
                      name="categories"
                      value={
                        category
                      }
                      className="
                        w-4
                        h-4
                        accent-black
                      "
                    />

                    {category}
                  </label>
                ),
              )}
            </div>
          </div>

          {/* PRICE */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Price *
            </label>

            <input
              name="price"
              required
              className={
                inputClasses
              }
              placeholder="KES 8,500"
            />
          </div>
        </div>

        {/* ==============================================================
            STOCK + STATUS
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          "
        >
          {/* STOCK */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Stock Quantity
            </label>

            <input
              name="stock"
              type="number"
              defaultValue={0}
              min="0"
              className={
                inputClasses
              }
            />
          </div>

          {/* NEW ARRIVAL */}

          <div
            className="
              flex
              items-center
              gap-4
              pt-6
            "
          >
            <input
              type="checkbox"
              name="isNew"
              id="isNew"
              className="
                w-4
                h-4
                accent-black
              "
            />

            <label
              htmlFor="isNew"
              className="
                text-[9px]
                font-black
                text-neutral-400
                uppercase
                tracking-[0.2em]
              "
            >
              New Arrival
            </label>
          </div>

          {/* DISABLED */}

          <div
            className="
              flex
              items-center
              gap-4
              pt-6
            "
          >
            <input
              type="checkbox"
              name="disabled"
              id="disabled"
              className="
                w-4
                h-4
                accent-red-600
              "
            />

            <label
              htmlFor="disabled"
              className="
                text-[9px]
                font-black
                text-neutral-400
                uppercase
                tracking-[0.2em]
              "
            >
              Disable Product
            </label>
          </div>
        </div>

        {/* ==============================================================
            DESCRIPTION
        =============================================================== */}

        <div className="space-y-2">
          <label
            className={
              labelClasses
            }
          >
            Description (one paragraph
            per line)
          </label>

          <textarea
            name="description"
            rows={4}
            className={
              inputClasses
            }
            placeholder={
              "Premium quality fabric...\nEthically sourced in Kenya..."
            }
          />
        </div>

        {/* ==============================================================
            PRODUCT DETAILS
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          "
        >
          {/* MATERIAL */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Material
            </label>

            <input
              name="material"
              className={
                inputClasses
              }
              placeholder="e.g., 100% Cotton"
            />
          </div>

          {/* CARE */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Care Instructions
            </label>

            <input
              name="care"
              className={
                inputClasses
              }
              placeholder="e.g., Machine wash cold"
            />
          </div>

          {/* ORIGIN */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Origin
            </label>

            <input
              name="origin"
              className={
                inputClasses
              }
              placeholder="e.g., Kenya"
            />
          </div>
        </div>

        {/* ==============================================================
            COLORS
        =============================================================== */}

        <div className="space-y-4">
          <label
            className={
              labelClasses
            }
          >
            Colors (up to 4)
          </label>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            <ColorPickerField
              index={0}
            />

            <ColorPickerField
              index={1}
            />

            <ColorPickerField
              index={2}
            />

            <ColorPickerField
              index={3}
            />
          </div>
        </div>

        {/* ==============================================================
            SIZES
        =============================================================== */}

        <div className="space-y-2">
          <label
            className={
              labelClasses
            }
          >
            Sizes (comma separated)
          </label>

          <input
            name="sizes"
            className={
              inputClasses
            }
            placeholder="XS, S, M, L, XL, XXL"
          />
        </div>

        {/* ==============================================================
            HERO IMAGE
        =============================================================== */}

        <div className="space-y-4">
          <label
            className={
              labelClasses
            }
          >
            Hero Image *
          </label>

          <input
            name="heroImage"
            type="file"
            required
            accept="image/*"
            className="
              w-full
              text-sm
              text-neutral-500

              file:mr-4
              file:py-3
              file:px-6

              file:border
              file:border-black

              file:text-[10px]
              file:font-black

              file:bg-white
              file:text-black

              hover:file:bg-black
              hover:file:text-white

              transition-colors
            "
          />
        </div>

        {/* ==============================================================
            THUMBNAILS
        =============================================================== */}

        <div className="space-y-4">
          <label
            className={
              labelClasses
            }
          >
            Thumbnails (up to 4)
          </label>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            {[1, 2, 3, 4].map(
              (number) => (
                <input
                  key={
                    number
                  }
                  name={`thumb${number}`}
                  type="file"
                  accept="image/*"
                  className="
                    text-sm
                    text-neutral-500

                    file:mr-4
                    file:py-2
                    file:px-4

                    file:border
                    file:border-neutral-200

                    file:text-[9px]
                    file:font-black

                    file:bg-white
                    file:text-neutral-600

                    hover:file:bg-black
                    hover:file:text-white
                  "
                />
              ),
            )}
          </div>
        </div>

        {/* ==============================================================
            SUBMIT
        =============================================================== */}

        <button
          type="submit"
          className="
            w-full

            bg-black
            text-white

            font-black

            py-6

            uppercase
            tracking-[0.3em]
            text-xs

            hover:bg-[#006241]

            transition-all
          "
        >
          Publish to Registry
        </button>
      </form>
    </div>
  );
}
