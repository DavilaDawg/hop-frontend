import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiX } from "react-icons/fi";

interface PlaceholderImage {
	id: number;
	src: string;
	alt: string;
}

const placeholderImages: PlaceholderImage[] = [
	{ id: 1, src: "/me.jpg", alt: "Grandma's cat" },
	{ id: 2, src: "/monkey.jpg", alt: "Pete Mitchell" },
	{ id: 3, src: "/PFP.jpg", alt: "Your boyfriend" },
	{ id: 4, src: "/emoji.jpg", alt: "Rizzler" },
	{ id: 5, src: "/patrick.jpg", alt: "Girls did" },
	{ id: 6, src: "/ani.jpg", alt: "Some anime guy" },
];

const PlaceholderImageStore: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<PlaceholderImage | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredImages, setFilteredImages] = useState(placeholderImages);

	useEffect(() => {
		const filtered = placeholderImages.filter((img) =>
			img.alt.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredImages(filtered);
	}, [searchTerm]);

	const handlePurchase = (image: PlaceholderImage) => {
		// purchase logic here
		alert(`You've successfully purchased "${image.alt}" for $1!`);
		setSelectedImage(null);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h2 className="text-3xl font-bold mb-6">Purchase Cusor</h2>

			<div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
				<div className="relative flex-grow">
					<input
						type="text"
						placeholder="Search images..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					{searchTerm && (
						// biome-ignore lint/a11y/useButtonType: <explanation>
						<button
							onClick={() => setSearchTerm("")}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							<FiX />
						</button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
				{filteredImages.map((image) => (
					<div key={image.id} className="flex flex-col items-center space-y-2">
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className="w-40 h-40 rounded-lg overflow-hidden bg-gray-200 cursor-pointer transition-transform hover:scale-105"
							onClick={() => setSelectedImage(image)}
						>
							<Image
								src={image.src}
								alt={image.alt}
								width={160}
								height={160}
								className="object-cover w-full h-full"
							/>
						</div>
						<p className="text-sm font-medium">{image.alt}</p>
					</div>
				))}
			</div>

			{selectedImage && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg p-6 max-w-lg w-full">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold">{selectedImage.alt}</h3>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								onClick={() => setSelectedImage(null)}
								className="text-gray-500 hover:text-gray-700"
							>
								<FiX size={24} />
							</button>
						</div>
						<div className="mb-4">
							<Image
								src={selectedImage.src}
								alt={selectedImage.alt}
								width={400}
								height={400}
								className="w-full h-auto rounded-lg"
							/>
						</div>
						<div className="flex justify-between items-center">
							<p className="text-xl font-bold">Price: $1.00</p>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								onClick={() => handlePurchase(selectedImage)}
								className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
							>
								Purchase
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PlaceholderImageStore;
