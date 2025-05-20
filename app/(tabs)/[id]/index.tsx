import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';
const dummyConcertImage = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80';
const dummyCommentPic = 'https://randomuser.me/api/portraits/women/1.jpg';

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  const [showAllReplies, setShowAllReplies] = useState(false);

  // Sample comments data
  const comments = [
    {
      id: 1,
      author: 'mehwish7343',
      time: '2 min',
      text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
      likes: 23,
      replies: [
        {
          id: 1,
          author: 'mehwish7343',
          time: '1 min',
          text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
          likes: 23,
        },
        {
          id: 2,
          author: 'mehwish7343',
          time: '1 min',
          text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
          likes: 23,
        },
        {
          id: 3,
          author: 'mehwish7343',
          time: '1 min',
          text: 'Another reply that is hidden initially',
          likes: 15,
        },
      ],
    },

    {
        id: 2,
        author: 'mehwish7343',
        time: '2 min',
        text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
        likes: 23,
        replies: [
          {
            id: 1,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 2,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 3,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Another reply that is hidden initially',
            likes: 15,
          },
        ],
      },

      {
        id: 3,
        author: 'mehwish7343',
        time: '2 min',
        text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
        likes: 23,
        replies: [
          {
            id: 1,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 2,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 3,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Another reply that is hidden initially',
            likes: 15,
          },
        ],
      },
      {
        id: 4,
        author: 'mehwish7343',
        time: '2 min',
        text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
        likes: 23,
        replies: [
          {
            id: 1,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 2,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 3,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Another reply that is hidden initially',
            likes: 15,
          },
        ],
      },

      {
        id: 5,
        author: 'mehwish7343',
        time: '2 min',
        text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
        likes: 23,
        replies: [
          {
            id: 1,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 2,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Glad to see. I wanna go to this concert, The best singer in the town.',
            likes: 23,
          },
          {
            id: 3,
            author: 'mehwish7343',
            time: '1 min',
            text: 'Another reply that is hidden initially',
            likes: 15,
          },
        ],
      },
  ];

  const renderContent = () => {
    if (activeTab === 'details') {
      return (
        <>
          <Text style={styles.description}>
            Tixly concert opens its doors for a unique virtual adventure full of terrifying surprises! With high-tech and cool special effects, this Metaverse experience offers thrills and chills for all!
          </Text>
          <Text style={styles.highlightsTitle}>Highlights</Text>
          <View style={styles.highlightsList}>
            <Text style={styles.highlightItem}>• Face your fears in a realistic experience</Text>
            <Text style={styles.highlightItem}>• Immerse yourself in sheer horror with the latest technology</Text>
          </View>
        </>
      );
    }

    return (
      <View style={styles.commentsSection}>
        <Text style={styles.commentsCount}>7 Comments</Text>
        
        {comments.map((comment) => (
          <View key={comment.id}>
            {/* Main comment */}
            <View style={styles.commentItem}>
              <Image source={{ uri: dummyCommentPic }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentAction}>
                    <Text style={styles.actionText}>Reply</Text>
                  </TouchableOpacity>
                  <Text style={styles.actionDivider}>•</Text>
                  <TouchableOpacity 
                    style={styles.commentAction}
                    onPress={() => setShowAllReplies(!showAllReplies)}
                  >
                    <Text style={styles.actionText}>
                      {showAllReplies ? 'Hide Replies' : `View ${comment.replies.length} Replies`}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.actionDivider}>•</Text>
                  <TouchableOpacity style={styles.commentAction}>
                    <Text style={styles.actionText}>{comment.likes} Likes</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.likeButton}>
                <Ionicons name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Replies */}
            {comment.replies
              .slice(0, showAllReplies ? comment.replies.length : 2)
              .map((reply) => (
                <View key={reply.id} style={[styles.commentItem, styles.replyItem]}>
                  <Image source={{ uri: dummyCommentPic }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{reply.author}</Text>
                      <Text style={styles.commentTime}>{reply.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{reply.text}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <Text style={styles.actionText}>Reply</Text>
                      </TouchableOpacity>
                      <Text style={styles.actionDivider}>•</Text>
                      <TouchableOpacity style={styles.commentAction}>
                        <Text style={styles.actionText}>{reply.likes} Likes</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.likeButton}>
                    <Ionicons name="heart-outline" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}

        <View style={styles.commentInput}>
          <TextInput 
            placeholder="Leave a Comment.."
            placeholderTextColor="#999"
            style={styles.commentTextInput}
          />
          <View style={styles.commentInputActions}>
            <TouchableOpacity>
              <Ionicons name="at" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="happy-outline" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#7F0102', '#0B0179']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Image source={{ uri: dummyProfilePic }} style={styles.profilePic} />
          </View>
        </View>

        {/* Event Card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: dummyConcertImage }} style={styles.eventImage} />
          <View style={styles.dateChip}>
            <Text style={styles.dateText}>02</Text>
            <Text style={styles.monthText}>Apr</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.eventTitle}>Tixly concert - The Immersive Experience</Text>
        </View>

        {/* Buy Button */}
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy it - PKR 500</Text>
        </TouchableOpacity>

        {/* General Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>General Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>Bahria Town, Lahore</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>08:00 PM - 10:00 PM</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>Apr 02, 2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>10 years +</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'details' && styles.activeTab]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
              onPress={() => setActiveTab('comments')}
            >
              <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Comments</Text>
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="ticket-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#E1E1E1" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF4B55',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  eventCard: {
    margin: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  dateChip: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthText: {
    color: 'white',
    fontSize: 14,
  },
  actionButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
  eventTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 12,
    fontFamily: 'Urbanist_600SemiBold',
  },
  buyButton: {
    backgroundColor: '#FF4B55',
    marginHorizontal: 12,
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  infoCard: {
    margin: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Urbanist_600SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#E1E1E1',
    width: 80,
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  infoValue: {
    color: 'white',
    flex: 1,
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  detailsCard: {
    margin: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
    marginBottom: 80,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    paddingBottom: 10,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#E1E1E1',
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  description: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  highlightsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  highlightsList: {
    marginLeft: 10,
  },
  highlightItem: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Urbanist_400Regular',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#130372',
    paddingVertical: 8,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  commentsSection: {
    paddingTop: 8,
  },
  commentsCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Urbanist_600SemiBold',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  commentAuthor: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 6,
    fontFamily: 'Urbanist_600SemiBold',
  },
  commentTime: {
    color: '#999',
    fontSize: 11,
    fontFamily: 'Urbanist_400Regular',
  },
  commentText: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: 'Urbanist_400Regular',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    marginRight: 8,
  },
  actionText: {
    color: '#999',
    fontSize: 11,
    fontFamily: 'Urbanist_400Regular',
  },
  actionDivider: {
    color: '#999',
    marginHorizontal: 4,
  },
  likeButton: {
    marginLeft: 12,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  commentTextInput: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    height: 32,
  },
  commentInputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  replyItem: {
    marginLeft: 40,
  },
}); 