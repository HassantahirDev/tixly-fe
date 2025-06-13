import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { homeApi } from '@/src/services/api';

export default function AdminEventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    homeApi
      .getEventById(id as string)
      .then((res: any) => setEvent(res.data?.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('default', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Handlers for comments and replies (no-op for now, can be implemented with API)
  const handleSubmitComment = () => {};
  const handleReply = (commentId: string) => {};
  const handleSubmitReply = (commentId: string) => {};

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator color="#FF4B55" size="large" />
      </View>
    );
  }
  if (!event) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: 'white' }}>Event not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace('/')
            }
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Image
              source={{ uri: event.organizer?.profilePic }}
              style={styles.profilePic}
            />
          </View>
        </View>

        {/* Event Card */}
        <View style={{ margin: 14 }}>
          <LinearGradient
            colors={['#7F0102', '#0B0179']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 18, padding: 16 }}
          >
            <View style={{ borderRadius: 16, overflow: 'hidden' }}>
              <Image
                source={{ uri: event.attachment }}
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 16,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderRadius: 10,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 'bold',
                    lineHeight: 16,
                  }}
                >
                  {new Date(event.date)
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                    })
                    .replace(' ', '\n')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 0,
                paddingVertical: 16,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 17,
                  fontFamily: 'Urbanist_600SemiBold',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
              >
                {event.title}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderRadius: 10,
                    padding: 8,
                    marginLeft: 8,
                  }}
                >
                  <Ionicons name="heart-outline" size={20} color="white" />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderRadius: 10,
                    padding: 8,
                    marginLeft: 8,
                  }}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Buy Button */}
        {/* <TouchableOpacity
          style={styles.buyButton}
          onPress={() => router.replace('/(tabs)/ticket')}
        >
          <Text style={styles.buyButtonText}>Buy it - PKR {event.price}</Text>
        </TouchableOpacity> */}

        {/* Organized By Card */}
        <View style={styles.organizedByCard}>
          <Text style={styles.organizedByTitle}>Organized by</Text>
          <View style={styles.organizedByContent}>
            <Image
              source={{ uri: event.organizer?.profilePic }}
              style={styles.organizedByAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.organizedByName}>
                {event.organizer?.name || 'Username'}
              </Text>
              <Text style={styles.organizedByMemberSince}>
                Member since 24 Feb
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity
              style={styles.organizedByDetailsBtn}
              onPress={() =>
                router.push({
                  pathname: `/event-detail/admin/${id}/organizer/${event.organizer?.id}`,

            
                })
              }
            >
              <Text style={styles.organizedByDetailsBtnText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* General Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>General Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{event.ageLimit} years +</Text>
          </View>
        </View>

        {/* Details Section (no tabs) */}
        <View style={styles.detailsCard}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.activeTab]}
              onPress={() => setActiveTab('details')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'details' && styles.activeTabText,
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
              onPress={() => setActiveTab('comments')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'comments' && styles.activeTabText,
                ]}
              >
                Comments
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'details' ? (
            <>
              <Text style={styles.description}>{event.description}</Text>
              <Text style={styles.highlightsTitle}>Highlights</Text>
              <View style={styles.highlightsList}>
                {Array.isArray(event.highlights) &&
                  event.highlights.map((highlight: any, index: number) => (
                    <Text key={index} style={styles.highlightItem}>
                      • {highlight}
                    </Text>
                  ))}
              </View>
            </>
          ) : (
            <View style={styles.commentsSection}>
              <Text style={styles.commentsCount}>
                {event.comments.length} Comments
              </Text>
              {Array.isArray(event.comments) &&
                event.comments.map((comment: any) => (
                  <View key={comment.id}>
                    <View style={styles.commentItem}>
                      <Image
                        source={{ uri: comment.user.profilePic }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentContent}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>
                            {comment.user.name}
                          </Text>
                          <Text style={styles.commentTime}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={styles.commentText}>
                          {comment.content}
                        </Text>
                        <View style={styles.commentActions}>
                          <TouchableOpacity
                            onPress={() => handleReply(comment.id)}
                          >
                            <Text
                              style={[
                                styles.actionText,
                                replyingTo === comment.id &&
                                  styles.activeActionText,
                              ]}
                            >
                              Reply
                            </Text>
                          </TouchableOpacity>
                          {comment.replies?.length > 0 && (
                            <>
                              <Text style={styles.actionDot}>•</Text>
                              <TouchableOpacity
                                onPress={() =>
                                  setShowAllReplies(!showAllReplies)
                                }
                              >
                                <Text style={styles.actionText}>
                                  {showAllReplies
                                    ? 'Hide Replies'
                                    : `View ${comment.replies.length} Replies`}
                                </Text>
                              </TouchableOpacity>
                            </>
                          )}
                          <Text style={styles.actionDot}>•</Text>
                          <TouchableOpacity>
                            <Text style={styles.actionText}>
                              {comment.likes?.length || 0} Likes
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* <TouchableOpacity style={styles.likeButton}>
                      <Ionicons name="heart-outline" size={20} color="white" />
                    </TouchableOpacity> */}
                    </View>

                    {replyingTo === comment.id && (
                      <View style={styles.replyInputContainer}>
                        <Image
                          source={{ uri: event.organizer?.profilePic }}
                          style={styles.replyAvatar}
                        />
                        <View style={styles.replyInput}>
                          <TextInput
                            placeholder="Write a reply..."
                            placeholderTextColor="#999"
                            style={styles.replyTextInput}
                            value={replyText}
                            onChangeText={setReplyText}
                            editable={!isSubmittingReply}
                          />
                          <TouchableOpacity
                            onPress={() => handleSubmitReply(comment.id)}
                            disabled={!replyText.trim() || isSubmittingReply}
                            style={[
                              styles.replyButton,
                              (!replyText.trim() || isSubmittingReply) &&
                                styles.replyButtonDisabled,
                            ]}
                          >
                            {isSubmittingReply ? (
                              <ActivityIndicator size="small" color="white" />
                            ) : (
                              <Ionicons name="send" size={20} color="white" />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {Array.isArray(comment.replies) &&
                      showAllReplies &&
                      comment.replies.map((reply: any) => (
                        <View
                          key={reply.id}
                          style={[styles.commentItem, styles.replyItem]}
                        >
                          <Image
                            source={{ uri: reply.user.profilePic }}
                            style={styles.commentAvatar}
                          />
                          <View style={styles.commentContent}>
                            <View style={styles.commentHeader}>
                              <Text style={styles.commentAuthor}>
                                {reply.user.name}
                              </Text>
                              <Text style={styles.commentTime}>
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </Text>
                            </View>
                            <Text style={styles.commentText}>
                              {reply.content}
                            </Text>
                            <View style={styles.commentActions}>
                              <TouchableOpacity>
                                <Text style={styles.actionText}>Reply</Text>
                              </TouchableOpacity>
                              <Text style={styles.actionDot}>•</Text>
                              <TouchableOpacity>
                                <Text style={styles.actionText}>0 Likes</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          {/* <TouchableOpacity style={styles.likeButton}>
                          <Ionicons
                            name="heart-outline"
                            size={20}
                            color="white"
                          />
                        </TouchableOpacity> */}
                        </View>
                      ))}
                  </View>
                ))}

              {/* <View style={styles.commentInput}>
                <TextInput
                  placeholder="Leave a Comment.."
                  placeholderTextColor="#999"
                  style={styles.commentTextInput}
                  value={commentText}
                  onChangeText={setCommentText}
                  editable={!isSubmitting}
                />
                <View style={styles.commentInputActions}>
                  <TouchableOpacity>
                    <Ionicons name="at" size={24} color="#999" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="happy-outline" size={24} color="#999" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmitting}
                    style={[
                      styles.sendButton,
                      (!commentText.trim() || isSubmitting) &&
                        styles.sendButtonDisabled,
                    ]}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Ionicons name="send" size={24} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              </View> */}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Approve/Decline Buttons */}
      {event.approvedByAdmin === false ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#BA0507',
              borderRadius: 30,
              paddingVertical: 10,
              paddingHorizontal: 36,
              backgroundColor: 'transparent',
              marginRight: 8,
              minWidth: 140,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#BA0507',
                fontSize: 14,
                fontFamily: 'Urbanist_400Regular',
              }}
            >
              Decline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#BA0507',
              borderRadius: 30,
              paddingVertical: 10,
              paddingHorizontal: 36,
              minWidth: 140,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: 'Urbanist_400Regular',
              }}
            >
              Approve
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            paddingVertical: 18,
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <Text style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 16 }}>
            Approved
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    paddingBottom: 8,
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
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  eventCard: {
    margin: 12,
    padding: 12,
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
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  monthText: {
    color: 'white',
    fontSize: 12,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  eventTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 12,
    fontFamily: 'Urbanist_600SemiBold',
  },
  buyButton: {
    backgroundColor: '#BA0507',
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
  organizedByCard: {
    margin: 12,
    padding: 12,
    backgroundColor: '#232323',
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  organizedByTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  organizedByContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizedByAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  organizedByName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  organizedByMemberSince: {
    color: '#E1E1E1',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  organizedByDetailsBtn: {
    borderWidth: 1,
    borderColor: '#505050',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 32,
    marginLeft: 'auto',
  },
  organizedByDetailsBtnText: {
    color: '#505050',
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
  },
  infoCard: {
    margin: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
    marginBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    paddingBottom: 8,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#E1E1E1',
    fontSize: 14,
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
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  highlightsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  highlightsList: {
    marginLeft: 8,
  },
  highlightItem: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Urbanist_400Regular',
  },
  commentsSection: {
    paddingTop: 4,
  },
  commentsCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
  actionText: {
    color: '#999',
    fontSize: 11,
    fontFamily: 'Urbanist_400Regular',
  },
  actionDot: {
    color: '#999',
    marginHorizontal: 4,
  },
  likeButton: {
    marginLeft: 8,
  },
  replyItem: {
    marginLeft: 40,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingBottom: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
  activeNavText: {
    color: '#FF4B55',
  },
  sendButton: {
    backgroundColor: '#FF4B55',
    borderRadius: 20,
    padding: 8,
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  activeActionText: {
    color: '#FF4B55',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 40,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  replyTextInput: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    height: 32,
  },
  replyButton: {
    backgroundColor: '#FF4B55',
    borderRadius: 16,
    padding: 6,
    marginLeft: 8,
  },
  replyButtonDisabled: {
    backgroundColor: '#666',
  },
});
