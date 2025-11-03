import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, Megaphone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppLayout } from './AppLayout';

interface NewsProps {
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
}

export function News({ onNavigate, onLogout }: NewsProps) {
  const newsItems = [
    {
      id: '1',
      title: 'New Collective Bargaining Agreement Signed with BDO',
      summary: 'ALU successfully negotiates better benefits and salary increases for all BDO employees.',
      date: '2024-03-10',
      category: 'Agreement',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Monthly General Assembly - March 2024',
      summary: 'Join us for important updates on union activities and member benefits discussion.',
      date: '2024-03-08',
      category: 'Event',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'New Member Benefits: Free Legal Consultation',
      summary: 'ALUzon now offers free legal consultation services to all verified members.',
      date: '2024-03-05',
      category: 'Benefits',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop'
    },
    {
      id: '4',
      title: 'Financial Literacy Workshop Series',
      summary: 'Enhance your financial knowledge with our upcoming workshop series starting March 22.',
      date: '2024-03-03',
      category: 'Education',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
    },
    {
      id: '5',
      title: 'Union Membership Drive Success',
      summary: 'We\'ve successfully added 500+ new members across various companies this quarter.',
      date: '2024-02-28',
      category: 'Membership',
      priority: 'low',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=200&fit=crop'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Agreement': return Users;
      case 'Event': return Calendar;
      case 'Benefits': return Megaphone;
      case 'Education': return Clock;
      case 'Membership': return Users;
      default: return Megaphone;
    }
  };

  return (
    <AppLayout
      currentScreen="news"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="p-4 max-w-md mx-auto lg:max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 rounded-full p-2">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Latest Updates</h2>
              <p className="text-sm text-gray-600">Stay informed with union news</p>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
          {newsItems.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category);
            return (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-all h-fit">
                <CardContent className="p-0">
                  {/* News Image */}
                  <div className="relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 lg:h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3 lg:line-clamp-4">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Read More →
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Load More News
          </button>
        </div>
      </div>
    </AppLayout>
  );
}